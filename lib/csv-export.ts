const UTF8_BOM = "﻿";

function escapeCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export function downloadCsv(rows: string[][], filename: string) {
  const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
  const blob = new Blob([UTF8_BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
