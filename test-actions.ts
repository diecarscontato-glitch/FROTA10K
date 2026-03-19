import { getBillingInfo } from "./app/actions/billing";
import { getAssets } from "./app/actions/assets";

async function test() {
  console.log("Testing getBillingInfo...");
  try {
    const info = await getBillingInfo();
    console.log("Billing info:", info);
  } catch (e) {
    console.error("Billing error:", e);
  }

  console.log("\nTesting getAssets...");
  try {
    const assets = await getAssets();
    console.log("Assets count:", assets.length);
  } catch (e) {
    console.error("Assets error:", e);
  }
}

test();
