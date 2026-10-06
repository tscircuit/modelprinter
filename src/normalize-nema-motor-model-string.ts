/** Accept assembly cable spellings without changing NEMA's resolved definition. */
export function normalizeNemaMotorModelString(value: string): string {
  if (!/^nema(?:8|17|23)(?:_|$)/i.test(value)) return value
  return value
    .replace(/(^|_)jst([0-9]+)_(ph|sh)(?=_|$)/gi, "$1jst$3$2")
    .replace(/(^|_)jst[_-](ph|sh)[_-]([0-9]+)(?=_|$)/gi, "$1jst$2$3")
    .replace(/(^|_)none(?=_|$)/gi, "$1nowires")
    .replace(/(^|_)stubs(?=_|$)/gi, "$1wirestubs")
}
