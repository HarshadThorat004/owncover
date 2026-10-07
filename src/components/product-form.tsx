"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CheckCircle2, ChevronDown, Loader2, Sparkles, X } from "lucide-react";
import { z } from "zod";

import UploadButtonComponent from "@/components/upload-button";
import DocumentCapture from "@/components/document-capture";
import SmartDateField from "@/components/smart-date-field";
import ScanFieldBadge from "@/components/scan-field-badge";
import { FormInput, FormLabel, FormTextarea } from "@/components/form-fields";
import PdfPlaceholder from "@/components/pdf-placeholder";
import { PRODUCT_CATEGORIES, EXTENDED_COVER_TYPES } from "@/constants/catalog";
import { canAutofillField, hasExtractedValue } from "@/lib/document-extract/apply-scan";
import { mergeByDocumentType } from "@/lib/document-extract/merge-scan";
import {
  SCAN_FAILED_MESSAGE,
  type ExtractedDocumentFields,
  type FieldConfidence,
  type FieldSource,
  type ScanHint,
} from "@/lib/document-extract/types";
import { computeExpiryFromPeriod } from "@/lib/warranty";

const WARRANTY_PERIOD_OPTIONS = [
  { months: 6, label: "6 months" },
  { months: 12, label: "12 months / 1 year" },
  { months: 18, label: "18 months / 1.5 years" },
  { months: 24, label: "24 months / 2 years" },
] as const;

const formSchema = z
  .object({
    name: z.string().min(1, "Product name is required").max(200),
    brand: z.string().max(100).optional(),
    model: z.string().max(120).optional(),
    category: z.string().max(40).optional(),
    retailer: z.string().max(80).optional(),
    serialNumber: z.string().max(100).optional(),
    invoiceNumber: z.string().max(100).optional(),
    purchaseAmount: z
      .string()
      .max(20)
      .optional()
      .refine(
        (value) =>
          !value ||
          /^\d{1,10}(\.\d{1,2})?$/.test(value.replace(/,/g, "").trim()),
        "Enter a valid amount"
      ),
    purchaseDate: z.string().min(1, "Purchase date is required"),
    warrantyExpiry: z.string().min(1, "Warranty expiry is required"),
    extendedExpiry: z.string().optional(),
    extendedType: z.string().max(40).optional(),
    notes: z.string().max(2000).optional(),
    renewalAvailable: z.boolean().optional(),
    renewalNotes: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    const purchase = new Date(data.purchaseDate);
    const expiry = new Date(data.warrantyExpiry);

    if (Number.isNaN(purchase.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid purchase date",
        path: ["purchaseDate"],
      });
    }

    if (Number.isNaN(expiry.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid warranty expiry",
        path: ["warrantyExpiry"],
      });
    }

    if (
      !Number.isNaN(purchase.getTime()) &&
      !Number.isNaN(expiry.getTime()) &&
      expiry < purchase
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Expiry must be on or after purchase date",
        path: ["warrantyExpiry"],
      });
    }

    if (data.extendedExpiry) {
      const extended = new Date(data.extendedExpiry);
      if (Number.isNaN(extended.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid extended cover date",
          path: ["extendedExpiry"],
        });
      } else if (!Number.isNaN(purchase.getTime()) && extended < purchase) {
        ctx.addIssue({
          code: "custom",
          message: "Extended cover must be on or after purchase date",
          path: ["extendedExpiry"],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

type ScanField =
  | "name"
  | "brand"
  | "model"
  | "category"
  | "retailer"
  | "serialNumber"
  | "invoiceNumber"
  | "purchaseAmount"
  | "purchaseDate"
  | "warrantyExpiry";

type DocumentType = {
  id?: string;
  fileUrl: string;
  fileType: string;
  documentType: "Invoice" | "Warranty Card" | "Other";
};

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  inboundDraftId?: string;
  defaultValues?: Partial<FormValues> & {
    documents?: DocumentType[];
    invoiceImage?: string | null;
  };
  initialScanHints?: Partial<Record<ScanField, ScanHint>>;
  focusScan?: boolean;
};

type ScanDocType = "Invoice" | "Warranty Card";

function todayIso() {
  return format(new Date(), "yyyy-MM-dd");
}

function nonEmpty(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function ocrErrorMessage(status: number, error: unknown) {
  if (status === 401) {
    return "Sign in again to scan documents.";
  }

  if (status === 504 || status === 408) {
    return "Scan timed out on the server — try a photo (JPG) or enter details manually.";
  }

  if (typeof error === "string" && error.trim()) {
    if (error === SCAN_FAILED_MESSAGE) {
      return "Could not read this document — try a clearer photo, a PDF with selectable text, or enter manually.";
    }

    return error;
  }

  return SCAN_FAILED_MESSAGE;
}

export default function ProductForm({
  mode,
  productId,
  inboundDraftId,
  defaultValues,
  initialScanHints,
  focusScan = false,
}: ProductFormProps) {
  const router = useRouter();
  const scanSectionRef = useRef<HTMLElement>(null);
  const [documents, setDocuments] = useState<DocumentType[]>(
    defaultValues?.documents ?? []
  );
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanExtracted, setScanExtracted] = useState(
    Boolean(initialScanHints && Object.keys(initialScanHints).length > 0)
  );
  const [scanDocType, setScanDocType] = useState<ScanDocType>("Invoice");
  const [scanPreviewUrl, setScanPreviewUrl] = useState<string | null>(null);
  const [scanPreviewType, setScanPreviewType] = useState<string>("image");
  const [scanFilled, setScanFilled] = useState<Set<ScanField>>(
    () =>
      new Set(
        Object.keys(initialScanHints ?? {}) as ScanField[]
      )
  );
  const [scanHints, setScanHints] = useState<Partial<Record<ScanField, ScanHint>>>(
    () => initialScanHints ?? {}
  );
  const userEdited = useRef<Set<ScanField>>(new Set());
  const lastScan = useRef<ExtractedDocumentFields | null>(null);
  const [selectedPeriodMonths, setSelectedPeriodMonths] = useState<number | null>(
    null
  );
  const [lightbox, setLightbox] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [showMore, setShowMore] = useState(
    mode === "edit" ||
      Boolean(defaultValues?.notes) ||
      Boolean(defaultValues?.renewalAvailable)
  );

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      brand: defaultValues?.brand ?? "",
      model: defaultValues?.model ?? "",
      category: defaultValues?.category ?? "",
      retailer: defaultValues?.retailer ?? "",
      serialNumber: defaultValues?.serialNumber ?? "",
      invoiceNumber: defaultValues?.invoiceNumber ?? "",
      purchaseAmount: defaultValues?.purchaseAmount ?? "",
      purchaseDate:
        defaultValues?.purchaseDate ||
        (mode === "create" && !inboundDraftId ? todayIso() : ""),
      warrantyExpiry: defaultValues?.warrantyExpiry ?? "",
      extendedExpiry: defaultValues?.extendedExpiry ?? "",
      extendedType: defaultValues?.extendedType || "store",
      notes: defaultValues?.notes ?? "",
      renewalAvailable: defaultValues?.renewalAvailable ?? false,
      renewalNotes: defaultValues?.renewalNotes ?? "",
    },
  });

  const renewalAvailable = useWatch({
    control,
    name: "renewalAvailable",
  });
  const purchaseDateValue = useWatch({
    control,
    name: "purchaseDate",
  });
  const categoryValue = useWatch({
    control,
    name: "category",
  });
  const isFormDirty =
    isDirty || documents.length !== (defaultValues?.documents?.length ?? 0);

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!isFormDirty || loading) return;
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isFormDirty, loading]);

  useEffect(() => {
    if (focusScan) {
      scanSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [focusScan]);

  useEffect(() => {
    if (!lightbox) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightbox(null);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightbox]);

  useEffect(() => {
    if (!selectedPeriodMonths || !purchaseDateValue) return;

    const expiry = computeExpiryFromPeriod(
      purchaseDateValue,
      selectedPeriodMonths
    );

    if (!expiry) return;

    const current = getValues("warrantyExpiry");
    if (current === expiry) return;

    setValue("warrantyExpiry", expiry, { shouldDirty: true });
  }, [purchaseDateValue, selectedPeriodMonths, getValues, setValue]);

  function markScanFilled(fields: ScanField[]) {
    setScanFilled((prev) => {
      const next = new Set(prev);
      fields.forEach((field) => next.add(field));
      return next;
    });
  }

  function clearScanBadge(field: ScanField) {
    setScanFilled((prev) => {
      if (!prev.has(field)) return prev;
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
  }

  function markUserEdited(field: ScanField) {
    userEdited.current.add(field);
    clearScanBadge(field);
  }

  function applyWarrantyPeriod(months: number) {
    const purchaseDate = getValues("purchaseDate");

    if (!purchaseDate) {
      toast.error("Set purchase date first");
      return;
    }

    const expiry = computeExpiryFromPeriod(purchaseDate, months);

    if (!expiry) {
      toast.error("Could not calculate expiry from purchase date");
      return;
    }

    setSelectedPeriodMonths(months);
    setValue("warrantyExpiry", expiry, {
      shouldDirty: true,
      shouldValidate: true,
    });
    markUserEdited("warrantyExpiry");
  }

  function nearestPeriodOption(months: number) {
    const exact = WARRANTY_PERIOD_OPTIONS.find(
      (option) => option.months === months
    );
    return exact?.months ?? months;
  }

  async function runOcr(
    imageUrl: string,
    file?: File,
    documentType: ScanDocType = scanDocType,
    uploadMimeType?: string
  ) {
    try {
      setScanning(true);
      setScanExtracted(false);
      toast.message("Extracting details from document…");

      const mimeTypeHint =
        file?.type?.split(";")[0]?.trim() ||
        uploadMimeType?.split(";")[0]?.trim();

      let payload: {
        imageUrl?: string;
        text?: string;
        qrPayload?: string;
        mimeType?: string;
      } = {
        imageUrl,
        ...(mimeTypeHint ? { mimeType: mimeTypeHint } : {}),
      };

      if (file?.type.startsWith("image/")) {
        try {
          toast.message("Reading document on this device…");
          const { recognizeDocumentImage } = await import(
            "@/lib/document-extract/browser-ocr"
          );
          const local = await recognizeDocumentImage(file, (message) =>
            toast.message(message)
          );
          if (local.text || local.qrPayload) {
            payload = {
              text: local.text,
              qrPayload: local.qrPayload ?? "",
            };
          }
        } catch (error) {
          console.error(error);
          toast.message("On-device read failed — trying server scan…");
          payload = {
            imageUrl,
            ...(mimeTypeHint ? { mimeType: mimeTypeHint } : {}),
          };
        }
      }

      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        toast.error(ocrErrorMessage(response.status, data.error));
        return;
      }

      let result = data.result as ExtractedDocumentFields;
      if (lastScan.current) {
        result = mergeByDocumentType(lastScan.current, result, documentType);
      }
      lastScan.current = result;

      const filled: ScanField[] = [];
      const hints: Partial<Record<ScanField, ScanHint>> = {};

      const tryFill = (
        field: ScanField,
        value: string | null,
        fieldConfidence?: FieldConfidence,
        source?: FieldSource,
        extra?: Pick<ScanHint, "derived">
      ) => {
        if (
          !canAutofillField({
            hasValue: hasExtractedValue(value),
            userEdited: userEdited.current.has(field),
            confidence: fieldConfidence,
          })
        ) {
          return;
        }

        setValue(field, value as string, { shouldDirty: true });
        filled.push(field);
        hints[field] = {
          confidence: fieldConfidence ?? "medium",
          source,
          ...extra,
        };
      };

      tryFill(
        "name",
        nonEmpty(result.name),
        result.fieldMeta?.name?.confidence,
        result.fieldMeta?.name?.source
      );
      tryFill(
        "brand",
        nonEmpty(result.brand),
        result.fieldMeta?.brand?.confidence,
        result.fieldMeta?.brand?.source
      );
      tryFill(
        "model",
        nonEmpty(result.model),
        result.fieldMeta?.model?.confidence,
        result.fieldMeta?.model?.source
      );
      tryFill(
        "category",
        nonEmpty(result.category),
        result.fieldMeta?.category?.confidence,
        result.fieldMeta?.category?.source
      );
      tryFill(
        "retailer",
        nonEmpty(result.retailer),
        result.fieldMeta?.retailer?.confidence,
        result.fieldMeta?.retailer?.source
      );
      tryFill(
        "serialNumber",
        nonEmpty(result.serialNumber),
        result.fieldMeta?.serialNumber?.confidence,
        result.fieldMeta?.serialNumber?.source
      );
      tryFill(
        "invoiceNumber",
        nonEmpty(result.invoiceNumber),
        result.fieldMeta?.invoiceNumber?.confidence,
        result.fieldMeta?.invoiceNumber?.source
      );
      tryFill(
        "purchaseAmount",
        nonEmpty(result.purchaseAmount),
        result.fieldMeta?.purchaseAmount?.confidence,
        result.fieldMeta?.purchaseAmount?.source
      );

      const scannedPurchaseDate = nonEmpty(result.purchaseDate);
      tryFill(
        "purchaseDate",
        scannedPurchaseDate,
        result.fieldMeta?.purchaseDate?.confidence,
        result.fieldMeta?.purchaseDate?.source
      );

      const purchaseDate =
        (userEdited.current.has("purchaseDate")
          ? nonEmpty(getValues("purchaseDate"))
          : scannedPurchaseDate) || nonEmpty(getValues("purchaseDate"));

      if (purchaseDate && result.warrantyPeriod) {
        const periodMonths =
          typeof result.warrantyPeriod === "number"
            ? result.warrantyPeriod
            : Number.parseInt(String(result.warrantyPeriod), 10);

        const expiry = computeExpiryFromPeriod(purchaseDate, periodMonths);
        const expiryConfidence = result.fieldMeta?.warrantyPeriod?.confidence;

        if (
          expiry &&
          !Number.isNaN(periodMonths) &&
          periodMonths > 0 &&
          canAutofillField({
            hasValue: true,
            userEdited: userEdited.current.has("warrantyExpiry"),
            confidence: expiryConfidence,
          })
        ) {
          setSelectedPeriodMonths(nearestPeriodOption(periodMonths));
          setValue("warrantyExpiry", expiry, { shouldDirty: true });
          filled.push("warrantyExpiry");
          hints.warrantyExpiry = {
            confidence: expiryConfidence ?? "medium",
            source: result.fieldMeta?.warrantyPeriod?.source,
            derived: true,
          };
        }
      }

      markScanFilled(filled);
      setScanHints((prev) => ({ ...prev, ...hints }));
      setScanExtracted(true);

      if (filled.length > 0) {
        toast.success(
          `Filled ${filled.length} field${filled.length > 1 ? "s" : ""} — review and edit below`
        );
      } else {
        toast.error("Sorry, unable to scan — enter manually.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Sorry, unable to scan — enter manually.");
    } finally {
      setScanning(false);
    }
  }

  function addDocument(
    url: string,
    documentType: DocumentType["documentType"],
    runScan = false,
    mimeType?: string,
    file?: File
  ) {
    const fileType =
      mimeType === "application/pdf" || url.toLowerCase().includes(".pdf")
        ? "pdf"
        : "image";

    setDocuments((prev) => [
      ...prev,
      {
        fileUrl: url,
        fileType,
        documentType,
      },
    ]);
    toast.success(`${documentType} uploaded`);

    if (runScan && documentType !== "Other") {
      setScanPreviewUrl(url);
      setScanPreviewType(fileType);
      setScanDocType(documentType);
      void runOcr(url, file, documentType, mimeType);
    }
  }

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);

      const body = {
        ...values,
        brand: values.brand || null,
        model: values.model || null,
        category: values.category || null,
        retailer: values.retailer || null,
        serialNumber: values.serialNumber || null,
        invoiceNumber: values.invoiceNumber || null,
        purchaseAmount: values.purchaseAmount?.replace(/,/g, "").trim() || null,
        extendedExpiry: values.extendedExpiry || null,
        extendedType: values.extendedExpiry
          ? values.extendedType || "store"
          : null,
        notes: values.notes || null,
        renewalNotes: values.renewalNotes || null,
        renewalAvailable: values.renewalAvailable ?? false,
        documents,
        invoiceImage:
          defaultValues?.invoiceImage ||
          documents.find((doc) => doc.fileType !== "pdf")?.fileUrl ||
          null,
      };

      const response = await fetch(
        mode === "create" ? "/api/products" : `/api/products/${productId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.code === "DUPLICATE_PRODUCT") {
          const duplicateOfId =
            result.details &&
            typeof result.details === "object" &&
            "duplicateOfId" in result.details &&
            typeof result.details.duplicateOfId === "string"
              ? result.details.duplicateOfId
              : null;

          toast.error(
            result.error ||
              "This product is already in your vault with the same details.",
            {
              duration: 10000,
              description: "Change a detail if this really is a second unit.",
              ...(duplicateOfId
                ? {
                    action: {
                      label: "Open existing",
                      onClick: () =>
                        router.push(`/dashboard/products/${duplicateOfId}`),
                    },
                  }
                : {}),
            }
          );
          return;
        }

        const firstError = result.details
          ? Object.values(result.details).flat()[0]
          : null;
        toast.error(
          (typeof firstError === "string" && firstError) ||
            result.error ||
            "Something went wrong"
        );
        return;
      }

      if (inboundDraftId && result.id) {
        await fetch(`/api/inbound/drafts/${inboundDraftId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "accepted",
            productId: result.id,
          }),
        }).catch(() => undefined);
      }

      if (mode === "create" && result.firstProduct) {
        toast.success("Saved. Reminders go out 30, 7, and 1 day before cover ends.", {
          description: "Turn on browser alerts so you also get them on this device.",
          duration: 10000,
          action: {
            label: "Settings",
            onClick: () => router.push("/dashboard/settings"),
          },
        });
      } else {
        toast.success(
          mode === "create"
            ? "Saved. Download a claim pack from this page."
            : "Product updated successfully"
        );
      }

      router.push(
        mode === "create"
          ? `/dashboard/products/${result.id}`
          : `/dashboard/products/${productId}`
      );
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {mode === "create" && (
        <ol className="grid grid-cols-3 gap-2 text-center text-[11px] uppercase tracking-[0.12em] text-gray-500">
          <li className="rounded-xl border border-white/10 bg-black/30 px-2 py-2.5 text-cyan-200">
            1. Scan
          </li>
          <li className="rounded-xl border border-white/10 bg-black/30 px-2 py-2.5">
            2. Check dates
          </li>
          <li className="rounded-xl border border-white/10 bg-black/30 px-2 py-2.5">
            3. Save
          </li>
        </ol>
      )}

      {/* SECTION 1 — Smart scan */}
      <section ref={scanSectionRef} className="scroll-mt-24 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Scan document</h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload or photograph an invoice or warranty card. Text is read on
            this device when possible. Scan both documents to fill more fields.
          </p>
        </div>

        <div className="flex gap-2">
          {(["Invoice", "Warranty Card"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setScanDocType(type)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                scanDocType === type
                  ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-300"
                  : "border-white/10 bg-black/40 text-gray-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <DocumentCapture
          size="lg"
          openCameraOnMobile={focusScan}
          label={
            scanDocType === "Invoice"
              ? "Upload invoice to auto-fill"
              : "Upload warranty card to auto-fill"
          }
          description="Photo, image, or PDF up to 8MB — scanned on this device"
          onUploaded={(url, fileType, file) =>
            addDocument(url, scanDocType, true, fileType, file)
          }
        />

        {scanPreviewUrl && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
              <p className="text-sm text-gray-400">
                Scanned {scanDocType}
              </p>
              {scanning ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-cyan-300">
                  <Loader2 size={12} className="animate-spin" />
                  Scanning…
                </span>
              ) : scanExtracted ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-cyan-300">
                  <CheckCircle2 size={12} />
                  Details extracted — review below
                </span>
              ) : null}
            </div>
            {scanPreviewType === "pdf" ? (
              <PdfPlaceholder
                sizeClassName="h-40"
                label="PDF uploaded — text extracted"
              />
            ) : (
              <button
                type="button"
                onClick={() =>
                  setLightbox({
                    url: scanPreviewUrl,
                    title: `Scanned ${scanDocType}`,
                  })
                }
                className="block w-full cursor-zoom-in text-left"
              >
                <Image
                  src={scanPreviewUrl}
                  alt="Scanned document"
                  width={1200}
                  height={400}
                  className="h-40 w-full object-cover transition hover:opacity-90"
                />
              </button>
            )}
          </div>
        )}

        {scanning && (
          <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            <Loader2 size={16} className="animate-spin" />
            <Sparkles size={16} />
            Extracting product details from your document…
          </div>
        )}
      </section>

      {/* SECTION 2 — Product details */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Product details</h2>
          <p className="mt-1 text-sm text-gray-500">
            {scanExtracted
              ? "We filled these. Please check every date before you save."
              : "Review auto-filled values or enter anything missing."}
          </p>
        </div>

        {scanExtracted && !scanning && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-100">
            Scan is a starting point, not a guarantee. Empty is better than a
            wrong expiry date. Hover or tap a Scanned or Verify tag to see why
            that field was filled.
          </div>
        )}

        <div>
          <div className="mb-2 flex flex-wrap items-center gap-1">
            <FormLabel htmlFor="name" className="mb-0">
              Product Name
            </FormLabel>
            <ScanFieldBadge
              show={scanFilled.has("name")}
              hint={scanHints.name}
            />
          </div>
          <FormInput
            id="name"
            placeholder="iPhone 15 Pro"
            error={errors.name?.message}
            {...register("name", {
              onChange: () => markUserEdited("name"),
            })}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-1">
              <FormLabel htmlFor="invoiceNumber" optional className="mb-0">
                Invoice Number
              </FormLabel>
              <ScanFieldBadge
                show={scanFilled.has("invoiceNumber")}
                hint={scanHints.invoiceNumber}
              />
            </div>
            <FormInput
              id="invoiceNumber"
              placeholder="INV-2024-001"
              error={errors.invoiceNumber?.message}
              {...register("invoiceNumber", {
                onChange: () => markUserEdited("invoiceNumber"),
              })}
            />
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-1">
              <FormLabel htmlFor="serialNumber" optional className="mb-0">
                {categoryValue === "phones" ? "IMEI / serial" : "Serial / IMEI"}
              </FormLabel>
              <ScanFieldBadge
                show={scanFilled.has("serialNumber")}
                hint={scanHints.serialNumber}
              />
            </div>
            <FormInput
              id="serialNumber"
              placeholder={
                categoryValue === "phones"
                  ? "*#06# or Settings > About"
                  : "From the box, rating plate, or card"
              }
              error={errors.serialNumber?.message}
              {...register("serialNumber", {
                onChange: () => markUserEdited("serialNumber"),
              })}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center gap-1">
            <FormLabel htmlFor="brand" optional className="mb-0">
              Brand
            </FormLabel>
              <ScanFieldBadge
                show={scanFilled.has("brand")}
                hint={scanHints.brand}
              />
          </div>
          <FormInput
            id="brand"
            placeholder="Apple"
            error={errors.brand?.message}
            {...register("brand", {
              onChange: () => markUserEdited("brand"),
            })}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-1">
              <FormLabel htmlFor="model" optional className="mb-0">
                Model
              </FormLabel>
              <ScanFieldBadge
                show={scanFilled.has("model")}
                hint={scanHints.model}
              />
            </div>
            <FormInput
              id="model"
              placeholder="WH-1000XM5"
              error={errors.model?.message}
              {...register("model", {
                onChange: () => markUserEdited("model"),
              })}
            />
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-1">
              <FormLabel htmlFor="category" optional className="mb-0">
                Category
              </FormLabel>
              <ScanFieldBadge
                show={scanFilled.has("category")}
                hint={scanHints.category}
              />
            </div>
            <select
              id="category"
              className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-white outline-none transition focus:border-cyan-400"
              {...register("category", {
                onChange: () => markUserEdited("category"),
              })}
            >
              <option value="">Select category</option>
              {PRODUCT_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            {errors.category?.message && (
              <p className="mt-1.5 text-sm text-red-400" role="alert">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-1">
              <FormLabel htmlFor="retailer" optional className="mb-0">
                Retailer
              </FormLabel>
              <ScanFieldBadge
                show={scanFilled.has("retailer")}
                hint={scanHints.retailer}
              />
            </div>
            <FormInput
              id="retailer"
              placeholder="Amazon, Croma, local store…"
              error={errors.retailer?.message}
              {...register("retailer", {
                onChange: () => markUserEdited("retailer"),
              })}
            />
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-1">
              <FormLabel htmlFor="purchaseAmount" optional className="mb-0">
                Purchase amount (INR)
              </FormLabel>
              <ScanFieldBadge
                show={scanFilled.has("purchaseAmount")}
                hint={scanHints.purchaseAmount}
              />
            </div>
            <FormInput
              id="purchaseAmount"
              inputMode="decimal"
              placeholder="24990"
              error={errors.purchaseAmount?.message}
              {...register("purchaseAmount", {
                onChange: () => markUserEdited("purchaseAmount"),
              })}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-1">
              <FormLabel htmlFor="purchaseDate" className="mb-0">
                Purchase Date
              </FormLabel>
              <ScanFieldBadge
                show={scanFilled.has("purchaseDate")}
                hint={scanHints.purchaseDate}
              />
            </div>
            <Controller
              name="purchaseDate"
              control={control}
              render={({ field }) => (
                <SmartDateField
                  id="purchaseDate"
                  value={field.value}
                  onChange={(value) => {
                    markUserEdited("purchaseDate");
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  error={errors.purchaseDate?.message}
                  hint={
                    mode === "create" && !scanFilled.has("purchaseDate")
                      ? "Pre-filled with today — edit or keep it"
                      : undefined
                  }
                />
              )}
            />
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-1">
              <FormLabel htmlFor="warrantyExpiry" className="mb-0">
                Manufacturer warranty
              </FormLabel>
              <ScanFieldBadge
                show={scanFilled.has("warrantyExpiry")}
                hint={scanHints.warrantyExpiry}
              />
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {WARRANTY_PERIOD_OPTIONS.map((option) => {
                const active = selectedPeriodMonths === option.months;

                return (
                  <button
                    key={option.months}
                    type="button"
                    onClick={() => applyWarrantyPeriod(option.months)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-200"
                        : "border-white/10 bg-black/40 text-gray-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <Controller
              name="warrantyExpiry"
              control={control}
              render={({ field }) => (
                <SmartDateField
                  id="warrantyExpiry"
                  value={field.value}
                  onChange={(value) => {
                    markUserEdited("warrantyExpiry");
                    setSelectedPeriodMonths(null);
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  error={errors.warrantyExpiry?.message}
                  hint="Pick a period above, or type DD / MM / YYYY"
                />
              )}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <p className="text-sm font-medium text-white">
            Store / extended cover
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Extra cover from the retailer, AMC, or brand — separate from the
            manufacturer period.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <FormLabel htmlFor="extendedType" optional>
                Cover type
              </FormLabel>
              <select
                id="extendedType"
                className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-white outline-none transition focus:border-cyan-400"
                {...register("extendedType")}
              >
                {EXTENDED_COVER_TYPES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FormLabel htmlFor="extendedExpiry" optional>
                Extra cover expiry
              </FormLabel>
              <Controller
                name="extendedExpiry"
                control={control}
                render={({ field }) => (
                  <SmartDateField
                    id="extendedExpiry"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.extendedExpiry?.message}
                    hint="Leave blank if you only have manufacturer cover"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {documents.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-white">Attached files</p>
            <div className="grid gap-4">
              {documents.map((doc, index) => (
                <div
                  key={`${doc.fileUrl}-${index}`}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                    <p className="text-sm text-gray-400">{doc.documentType}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setDocuments((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                        if (doc.fileUrl === scanPreviewUrl) {
                          setScanPreviewUrl(null);
                          setScanExtracted(false);
                        }
                      }}
                      className="text-sm text-red-400 transition hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                  {doc.fileType === "pdf" ? (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition hover:opacity-90"
                    >
                      <PdfPlaceholder
                        sizeClassName="h-48"
                        label={doc.documentType}
                      />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setLightbox({
                          url: doc.fileUrl,
                          title: doc.documentType,
                        })
                      }
                      className="block w-full cursor-zoom-in text-left"
                    >
                      <Image
                        src={doc.fileUrl}
                        alt={doc.documentType}
                        width={1200}
                        height={800}
                        className="h-48 w-full object-cover transition hover:opacity-90"
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <div>
        <button
          type="button"
          onClick={() => setShowMore((open) => !open)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-white"
          aria-expanded={showMore}
        >
          <ChevronDown
            size={16}
            className={`transition ${showMore ? "rotate-180" : ""}`}
          />
          {showMore ? "Hide extra fields" : "Add more (notes, extra files)"}
        </button>

        {showMore && (
          <div className="mt-6 space-y-8">
            <div>
              <FormLabel htmlFor="notes" optional>
                Notes
              </FormLabel>
              <FormTextarea
                id="notes"
                rows={4}
                placeholder="Service history, claim tips, store location…"
                error={errors.notes?.message}
                {...register("notes")}
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 bg-black text-cyan-400"
                  {...register("renewalAvailable")}
                />
                Renewal / extension available
              </label>

              {renewalAvailable && (
                <div className="mt-4">
                  <FormLabel htmlFor="renewalNotes" optional>
                    Renewal Notes
                  </FormLabel>
                  <FormTextarea
                    id="renewalNotes"
                    rows={2}
                    placeholder="e.g. AppleCare+ available until March 2027"
                    error={errors.renewalNotes?.message}
                    {...register("renewalNotes")}
                  />
                </div>
              )}
            </div>

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Extra files
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Invoice and warranty card uploads also merge into the form.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                    Invoice
                  </p>
                  <UploadButtonComponent
                    label="Add Invoice"
                    onChange={(url, fileType, file) =>
                      addDocument(url, "Invoice", true, fileType, file)
                    }
                  />
                </div>
                <div>
                  <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                    Warranty Card
                  </p>
                  <UploadButtonComponent
                    label="Add Card"
                    onChange={(url, fileType, file) =>
                      addDocument(url, "Warranty Card", true, fileType, file)
                    }
                  />
                </div>
                <div>
                  <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                    Other
                  </p>
                  <UploadButtonComponent
                    label="Add File"
                    onChange={(url, fileType) =>
                      addDocument(url, "Other", false, fileType)
                    }
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || scanning}
        className="premium-btn premium-btn-solid inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Saving…" : mode === "create" ? "Save to vault" : "Save Changes"}
      </button>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={() => setLightbox(null)}
        >
          <div
            className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur-md"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="min-w-0 truncate text-sm font-medium text-white">
              {lightbox.title}
            </p>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close image"
            >
              <X size={20} />
            </button>
          </div>
          <div
            className="flex flex-1 items-center justify-center p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={lightbox.url}
              alt={lightbox.title}
              width={1600}
              height={1200}
              className="max-h-[calc(100vh-5.5rem)] w-auto max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </form>
  );
}
