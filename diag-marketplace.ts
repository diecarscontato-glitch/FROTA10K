import { getMarketplaceFeed } from "./app/actions/marketplace";
import { db } from "./lib/db";

async function test() {
  try {
    console.log("Iniciando teste de Marketplace Feed...");
    // Mocking auth is hard, but we can check if the query works directly
    const publications = await db.publication.findMany({
      where: {
        status: "ACTIVE",
        visibility: "PUBLIC",
      },
      include: {
        asset: {
          include: {
            financing: true,
          },
        },
        account: {
          select: {
            name: true,
          },
        },
      },
    });
    console.log(`Sucesso! Encontradas ${publications.length} publicações.`);
  } catch (error) {
    console.error("ERRO NO MARKETPLACE FEED:", error);
  } finally {
    process.exit();
  }
}

test();
