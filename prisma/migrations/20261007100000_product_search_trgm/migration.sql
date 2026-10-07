-- Trigram indexes so vault search (ILIKE '%q%') stays fast on large vaults.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "Product_name_trgm_idx" ON "Product" USING GIN ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Product_brand_trgm_idx" ON "Product" USING GIN ("brand" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Product_model_trgm_idx" ON "Product" USING GIN ("model" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Product_retailer_trgm_idx" ON "Product" USING GIN ("retailer" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Product_serialNumber_trgm_idx" ON "Product" USING GIN ("serialNumber" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Product_invoiceNumber_trgm_idx" ON "Product" USING GIN ("invoiceNumber" gin_trgm_ops);
