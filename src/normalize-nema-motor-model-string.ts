/** Accept assembly cable spellings without changing NEMA's resolved definition. */
export function normalizeNemaMotorModelString(value: string): string {
  if (!/^nema(?:8|17|23)(?:_|$)/i.test(value)) return value
  return value
    .replace(/(^|_)(?:jst6_ph|jst_ph_6|jst-ph-6)(?=_|$)/gi, "$1jstph6")
    .replace(/(^|_)none(?=_|$)/gi, "$1nowires")
    .replace(/(^|_)stubs(?=_|$)/gi, "$1wirestubs")
}
