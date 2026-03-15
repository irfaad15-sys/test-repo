// =============================================================================
// Google Sheets API — Read/Write to the 32-sheet workbook
// =============================================================================

import { google, sheets_v4 } from "googleapis";
import { SHEET_REGISTRY, SheetConfig } from "./types";

// -----------------------------------------------------------------------------
// Auth
// -----------------------------------------------------------------------------

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetsClient(): sheets_v4.Sheets {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
}

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

// -----------------------------------------------------------------------------
// Generic Read
// -----------------------------------------------------------------------------

export async function readSheet<T extends Record<string, unknown>>(
  sheetKey: string,
  filters?: Partial<T>
): Promise<T[]> {
  const config = SHEET_REGISTRY[sheetKey];
  if (!config) throw new Error(`Unknown sheet: ${sheetKey}`);

  const sheets = getSheetsClient();
  const range = `'${config.sheetName}'!A${config.headerRow}:ZZ`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0] as string[];
  const data = rows.slice(1).map((row) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((header, i) => {
      const col = config.columns.find(
        (c) => c.toLowerCase() === header.toLowerCase().replace(/\s+/g, "")
      );
      if (col) {
        obj[col] = parseValue(row[i]);
      }
    });
    return obj as T;
  });

  if (filters) {
    return data.filter((item) =>
      Object.entries(filters).every(
        ([key, value]) => item[key as keyof T] === value
      )
    );
  }

  return data;
}

// -----------------------------------------------------------------------------
// Generic Write (append row)
// -----------------------------------------------------------------------------

export async function appendToSheet<T extends Record<string, unknown>>(
  sheetKey: string,
  data: T | T[]
): Promise<void> {
  const config = SHEET_REGISTRY[sheetKey];
  if (!config) throw new Error(`Unknown sheet: ${sheetKey}`);

  const sheets = getSheetsClient();
  const rows = Array.isArray(data) ? data : [data];

  const values = rows.map((row) =>
    config.columns.map((col) => {
      const val = row[col];
      if (val === undefined || val === null) return "";
      if (Array.isArray(val)) return val.join(", ");
      return String(val);
    })
  );

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${config.sheetName}'!A${config.headerRow + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
}

// -----------------------------------------------------------------------------
// Generic Update (by key column match)
// -----------------------------------------------------------------------------

export async function updateSheetRow<T extends Record<string, unknown>>(
  sheetKey: string,
  keyValue: string,
  updates: Partial<T>
): Promise<boolean> {
  const config = SHEET_REGISTRY[sheetKey];
  if (!config) throw new Error(`Unknown sheet: ${sheetKey}`);

  const sheets = getSheetsClient();
  const range = `'${config.sheetName}'!A${config.headerRow}:ZZ`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return false;

  const headers = rows[0] as string[];
  const keyColIndex = headers.findIndex(
    (h) => h.toLowerCase().replace(/\s+/g, "") === config.keyColumn.toLowerCase()
  );
  if (keyColIndex === -1) return false;

  const rowIndex = rows.findIndex(
    (row, i) => i > 0 && row[keyColIndex] === keyValue
  );
  if (rowIndex === -1) return false;

  const updatedRow = [...rows[rowIndex]];
  Object.entries(updates).forEach(([key, value]) => {
    const colIndex = headers.findIndex(
      (h) => h.toLowerCase().replace(/\s+/g, "") === key.toLowerCase()
    );
    if (colIndex !== -1) {
      updatedRow[colIndex] = value === null ? "" : String(value);
    }
  });

  const updateRange = `'${config.sheetName}'!A${config.headerRow + rowIndex}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: updateRange,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [updatedRow] },
  });

  return true;
}

// -----------------------------------------------------------------------------
// Batch Read — fetch multiple sheets at once
// -----------------------------------------------------------------------------

export async function batchReadSheets(
  sheetKeys: string[]
): Promise<Record<string, Record<string, unknown>[]>> {
  const sheets = getSheetsClient();
  const ranges = sheetKeys.map((key) => {
    const config = SHEET_REGISTRY[key];
    if (!config) throw new Error(`Unknown sheet: ${key}`);
    return `'${config.sheetName}'!A${config.headerRow}:ZZ`;
  });

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    ranges,
  });

  const result: Record<string, Record<string, unknown>[]> = {};

  response.data.valueRanges?.forEach((valueRange, idx) => {
    const key = sheetKeys[idx];
    const config = SHEET_REGISTRY[key];
    const rows = valueRange.values;

    if (!rows || rows.length < 2) {
      result[key] = [];
      return;
    }

    const headers = rows[0] as string[];
    result[key] = rows.slice(1).map((row) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((header, i) => {
        const col = config.columns.find(
          (c) => c.toLowerCase() === header.toLowerCase().replace(/\s+/g, "")
        );
        if (col) obj[col] = parseValue(row[i]);
      });
      return obj;
    });
  });

  return result;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function parseValue(val: string | undefined): string | number | boolean {
  if (val === undefined || val === "") return "";
  if (val === "TRUE" || val === "true") return true;
  if (val === "FALSE" || val === "false") return false;
  const num = Number(val);
  if (!isNaN(num) && val.trim() !== "") return num;
  return val;
}

export function getSheetConfig(sheetKey: string): SheetConfig {
  const config = SHEET_REGISTRY[sheetKey];
  if (!config) throw new Error(`Unknown sheet: ${sheetKey}`);
  return config;
}
