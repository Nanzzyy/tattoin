-- Normalize previously stored R2 URLs when R2_PUBLIC_URL was configured without a scheme.
UPDATE "PortfolioItem"
SET "imageUrl" = 'https://' || "imageUrl"
WHERE "imageKey" IS NOT NULL
  AND "imageUrl" !~* '^https?://';
