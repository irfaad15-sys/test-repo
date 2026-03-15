/**
 * Rate Sync Script — Update rates from vendor quotes or market data
 *
 * Usage: npx ts-node scripts/sync-rates.ts
 *
 * Reads current rates, compares with previous, and updates the Rate Master
 * and Rate History sheets. Can be scheduled via cron or n8n.
 */

import { google } from "googleapis";

interface RateUpdate {
  category: string;
  item: string;
  newRate: number;
  vendor: string;
  source: "market" | "vendor_quote" | "contract";
}

// These would come from an external API or manual input
const RATE_UPDATES: RateUpdate[] = [
  { category: "Cement", item: "OPC 53 Grade", newRate: 430, vendor: "ACC Dealers", source: "market" },
  { category: "Steel", item: "Fe500D TMT Bars", newRate: 74, vendor: "TATA Steel", source: "vendor_quote" },
  { category: "Sand", item: "M-Sand", newRate: 48, vendor: "Rock Aggregates", source: "market" },
  { category: "Aggregate", item: "20mm Crushed Stone", newRate: 40, vendor: "Rock Aggregates", source: "market" },
];

async function main() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;
  const today = new Date().toISOString().split("T")[0];

  // Read current Rate Master
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "'Rate Master'!A1:ZZ",
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) {
    console.log("No existing rates found.");
    return;
  }

  const headers = rows[0] as string[];
  const itemIdx = headers.indexOf("item");
  const currentRateIdx = headers.indexOf("currentRate");
  const previousRateIdx = headers.indexOf("previousRate");
  const lastUpdatedIdx = headers.indexOf("lastUpdated");

  let updatedCount = 0;
  const historyEntries: string[][] = [];

  for (const update of RATE_UPDATES) {
    const rowIndex = rows.findIndex(
      (row, i) => i > 0 && row[itemIdx] === update.item
    );

    if (rowIndex === -1) {
      console.log(`  Item not found: ${update.item}`);
      continue;
    }

    const currentRate = Number(rows[rowIndex][currentRateIdx]);
    if (currentRate === update.newRate) {
      console.log(`  ${update.item}: No change (₹${currentRate})`);
      continue;
    }

    // Update Rate Master
    rows[rowIndex][previousRateIdx] = String(currentRate);
    rows[rowIndex][currentRateIdx] = String(update.newRate);
    rows[rowIndex][lastUpdatedIdx] = today;

    const change = ((update.newRate - currentRate) / currentRate * 100).toFixed(1);
    console.log(`  ${update.item}: ₹${currentRate} → ₹${update.newRate} (${Number(change) > 0 ? "+" : ""}${change}%)`);

    // Add to history
    historyEntries.push([
      `RH${Date.now()}`,
      "", // materialId — would be looked up
      "", // vendorId
      "", // poId
      today,
      String(update.newRate),
      "",
      `Rate updated from ₹${currentRate}`,
    ]);

    updatedCount++;
  }

  if (updatedCount > 0) {
    // Write back Rate Master
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "'Rate Master'!A1:ZZ",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: rows },
    });

    // Append to Rate History
    if (historyEntries.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "'Rate History'!A2",
        valueInputOption: "USER_ENTERED",
        requestBody: { values: historyEntries },
      });
    }

    console.log(`\n✓ Updated ${updatedCount} rates, ${historyEntries.length} history entries added.`);
  } else {
    console.log("\nNo rate changes to apply.");
  }
}

main().catch(console.error);
