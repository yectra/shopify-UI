-- CreateTable
CREATE TABLE "AffiliateUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" BIGINT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT,
    "phone" BIGINT,
    "websiteTraffic" INTEGER,
    "marketingExperience" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PromotionalMethods" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "affiliateUserId" INTEGER,
    CONSTRAINT "PromotionalMethods_affiliateUserId_fkey" FOREIGN KEY ("affiliateUserId") REFERENCES "AffiliateUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InstagramUrl" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "promotionalMethodsId" INTEGER NOT NULL,
    CONSTRAINT "InstagramUrl_promotionalMethodsId_fkey" FOREIGN KEY ("promotionalMethodsId") REFERENCES "PromotionalMethods" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "YouTubeUrl" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "promotionalMethodsId" INTEGER NOT NULL,
    CONSTRAINT "YouTubeUrl_promotionalMethodsId_fkey" FOREIGN KEY ("promotionalMethodsId") REFERENCES "PromotionalMethods" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TwitterUrl" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "promotionalMethodsId" INTEGER NOT NULL,
    CONSTRAINT "TwitterUrl_promotionalMethodsId_fkey" FOREIGN KEY ("promotionalMethodsId") REFERENCES "PromotionalMethods" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlogUrl" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "promotionalMethodsId" INTEGER NOT NULL,
    CONSTRAINT "BlogUrl_promotionalMethodsId_fkey" FOREIGN KEY ("promotionalMethodsId") REFERENCES "PromotionalMethods" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AffiliateLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AffiliateLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AffiliateUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AffiliateProgram" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "commission" REAL NOT NULL,
    "eligibility" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "price" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProgramProducts" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProgramProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "AffiliateProgram" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProgramProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProgramCategories" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProgramCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "AffiliateProgram" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProgramCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProgramProducts_AB_unique" ON "_ProgramProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_ProgramProducts_B_index" ON "_ProgramProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProgramCategories_AB_unique" ON "_ProgramCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_ProgramCategories_B_index" ON "_ProgramCategories"("B");
