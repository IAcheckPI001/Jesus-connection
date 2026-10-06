
/**
 * Ghép họ và tên, bỏ phần rỗng và gộp khoảng trắng.
 *
 * @example getFullName('Nguyễn Thị Kim', 'Tuyến') // 'Nguyễn Thị Kim Tuyến'
 * @example getFullName('', 'Anh') // 'Anh'
 * @example getFullName('Cao Văn', '') // 'Cao Văn'
 * @example getFullName('  Cao   Văn ', 'Đông') // 'Cao Văn Đông'
 */
export function getFullName(ho: string, ten: string): string {
  return `${ho} ${ten}`.replace(/\s+/g, ' ').trim();
}

/** Lowercases text, removes Vietnamese diacritics, maps đ/Đ to d and trims whitespace. */
export function normalizeSearchText(s: string): string {
  return s
    .replace(/[đĐ]/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Formats an ISO date as dd/MM/yyyy without parsing the input as a local date.
 * Invalid dates return an em dash.
 *
 * @example formatNgaySinh('2008-09-18') // '18/09/2008'
 * @example formatNgaySinh('2008-02-30') // '—'
 * @example formatNgaySinh('abc') // '—'
 * @example formatNgaySinh('') // '—'
 * @example formatNgaySinh(null) // '—'
 */
export function formatNgaySinh(iso: string | null): string {
  if (!iso) return '—';

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match || !isValidIsoDate(iso)) return '—';

  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function isValidIsoDate(iso: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

export function getRowNumber(page: number, pageSize: number, indexInPage: number): number {
  return ((page - 1) * pageSize) + indexInPage + 1;
}
