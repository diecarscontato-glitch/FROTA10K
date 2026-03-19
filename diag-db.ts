import { db } from "./lib/db";

async function diagnose() {
  console.log("Checking Accounts...");
  const accounts = await db.account.findMany();
  console.log(`Found ${accounts.length} accounts.`);
  accounts.forEach(a => console.log(`Account: ${a.name} (ID: ${a.id})`));

  if (accounts.length > 0) {
    const accId = accounts[0].id;
    console.log(`\nChecking Leads for Account ${accId}...`);
    const leads = await db.lead.findMany({ where: { account_id: accId } });
    console.log(`Found ${leads.length} leads.`);
    leads.forEach(l => console.log(`Lead: ${l.name}`));

    console.log(`\nChecking Assets for Account ${accId}...`);
    const assets = await db.asset.findMany({ where: { account_id: accId } });
    console.log(`Found ${assets.length} assets.`);
    assets.forEach(a => console.log(`Asset: ${a.brand} ${a.model}`));
  }
}

diagnose();
 house value: 
