/** Parses "MM/YYYY" into a comparable number (YYYYMM). Returns null if incomplete/invalid. */
export function parseMY(value: string): number | null {
  if (!value || value.length !== 7) return null;
  const [mm, yyyy] = value.split("/");
  const month = parseInt(mm, 10);
  const year = parseInt(yyyy, 10);
  if (isNaN(month) || isNaN(year)) return null;
  if (month < 1 || month > 12) return null;
  if (year < 1900 || year > 9999) return null;
  return year * 100 + month;
}

export function currentMY(): number {
  const now = new Date();
  return now.getFullYear() * 100 + (now.getMonth() + 1);
}

export function isFuture(value: string): boolean {
  const d = parseMY(value);
  if (d === null) return false;
  return d > currentMY();
}

export function isStartAfterEnd(start: string, end: string): boolean {
  const s = parseMY(start);
  const e = parseMY(end);
  if (s === null || e === null) return false;
  return s >= e;
}
