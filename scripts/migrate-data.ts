/**
 * Migration Script — Import existing data into the new sheet structure
 *
 * Usage: npx ts-node scripts/migrate-data.ts
 *
 * This script reads from your existing sheets/files and maps them
 * into the standardized 32-sheet structure.
 */

import { google } from "googleapis";

interface MigrationMapping {
  sourceSheet: string;
  targetSheet: string;
  columnMap: Record<string, string>; // source -> target column name
}

const MIGRATIONS: MigrationMapping[] = [
  {
    sourceSheet: "Existing BOQ",
    targetSheet: "BOQ Budget",
    columnMap: {
      "Sl No": "boqId",
      "Work Item": "item",
      "Category": "category",
      "Description": "description",
      "Unit": "unit",
      "Qty": "quantity",
      "Rate": "rate",
      "Amount": "amount",
      "Floor": "floor",
    },
  },
  {
    sourceSheet: "Material List",
    targetSheet: "Material Master",
    columnMap: {
      "Material Name": "materialName",
      "Category": "category",
      "Unit": "unit",
      "HSN": "hsnCode",
      "GST %": "gstRate",
      "Min Stock": "reorderLevel",
    },
  },
  {
    sourceSheet: "Vendor List",
    targetSheet: "Vendor Master",
    columnMap: {
      "Name": "vendorName",
      "Contact": "contactPerson",
      "Phone": "phone",
      "Email": "email",
      "GST No": "gstNumber",
      "Materials": "materialsSupplied",
    },
  },
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

  for (const migration of MIGRATIONS) {
    console.log(`\nMigrating: ${migration.sourceSheet} → ${migration.targetSheet}`);

    try {
      // Read source data
      const source = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${migration.sourceSheet}'!A1:ZZ`,
      });

      const rows = source.data.values;
      if (!rows || rows.length < 2) {
        console.log("  No data found, skipping.");
        continue;
      }

      const sourceHeaders = rows[0] as string[];
      const dataRows = rows.slice(1);

      // Read target headers
      const target = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${migration.targetSheet}'!1:1`,
      });

      const targetHeaders = (target.data.values?.[0] || []) as string[];

      // Map data
      const mappedRows = dataRows.map((row, rowIdx) => {
        return targetHeaders.map((targetCol) => {
          const sourceCol = Object.entries(migration.columnMap).find(
            ([, target]) => target === targetCol
          )?.[0];

          if (!sourceCol) {
            // Auto-generate IDs for first column
            if (targetCol.endsWith("Id") || targetCol.endsWith("id")) {
              return `${migration.targetSheet.substring(0, 3).toUpperCase()}${String(rowIdx + 1).padStart(3, "0")}`;
            }
            return "";
          }

          const sourceIdx = sourceHeaders.indexOf(sourceCol);
          return sourceIdx >= 0 ? row[sourceIdx] || "" : "";
        });
      });

      // Write to target
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `'${migration.targetSheet}'!A2`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: mappedRows },
      });

      console.log(`  ✓ Migrated ${mappedRows.length} rows`);
    } catch (error) {
      console.log(`  ✗ Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  console.log("\nMigration complete.");
}

main().catch(console.error);
