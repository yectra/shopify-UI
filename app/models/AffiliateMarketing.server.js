import prisma from "../db.server.js"
 
export async function createAffiliateUser(inputData) {
  console.log(inputData)
    try {
        const newUser = await prisma.affiliateUser.create({
            data: {
                userId: inputData.userId,
                firstName: inputData.firstName,
                lastName: inputData.lastName,
                email: inputData.email,
                phone: inputData.phone,
                websiteTraffic: inputData.websiteTraffic,
                marketingExperience: inputData.marketingExperience,
                promotionalMethods: {
                    create: inputData.promotionalMethods.map(method => ({
                        instagramUrls: {
                            create: method.instagramUrls.map(url => ({ url })),
                        },
                        youtubeUrls: {
                            create: method.youtubeUrls.map(url => ({ url })),
                        },
                        twitterUrls: {
                            create: method.twitterUrls.map(url => ({ url })),
                        },
                        blogUrls: {
                            create: method.blogUrls.map(url => ({ url })),
                        },
                    })),
                },
            },
        });
 
        console.log("Affiliate User Created:", newUser);
        return newUser;
    } catch (error) {
        console.error("Error creating affiliate user:", error.message);
        throw error;
    }
}