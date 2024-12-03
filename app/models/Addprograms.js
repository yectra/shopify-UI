import prisma from "../db.server.js";

export async function createAffiliateProgram(programData) {
    console.log(programData)
  try {
    const { name, commission, eligibility, scope, selectedProducts, selectedCategories } = programData;

    const program = await prisma.affiliateProgram.create({
      data: {
        name,
        commission: parseFloat(commission),
        eligibility,
        scope,
        selectedProducts: {
          connect: selectedProducts.map((product) => ({ id: product.id })),
        },
        selectedCategories: {
          connect: selectedCategories.map((category) => ({ id: category.id })),
        },
      },
    });

    return program;
  } catch (error) {
    console.error("Error creating affiliate program:", error);
    throw new Error("Failed to create affiliate program");
  }
}

export async function loadAffiliatePrograms() {
  try {
    const programs = await prisma.affiliateProgram.findMany({
      include: {
        selectedProducts: true,
        selectedCategories: true,
      },
    });
    return programs;
  } catch (error) {
    console.error("Error loading affiliate programs:", error);
    throw new Error("Failed to load affiliate programs");
  }
}