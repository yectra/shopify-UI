/*
  Warnings:

  - You are about to drop the `_ProgramCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProgramProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ProgramCategories";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ProgramProducts";
PRAGMA foreign_keys=on;
