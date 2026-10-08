import {
  parseModelStringParams,
  type RawModelprinterParams,
} from "../parse-model-string"
import { splitModelStringTokens } from "../split-model-string-tokens"

type StringFlags = Readonly<Record<string, string>>

/** Translate only complete, model-local flags; leave validation to the parser. */
export function expandModelStringFlags(
  value: string,
  flags: StringFlags,
): string {
  return splitModelStringTokens(value)
    .map((token, index) =>
      index > 0 && Object.hasOwn(flags, token.toLowerCase())
        ? flags[token.toLowerCase()]!
        : token,
    )
    .join("_")
}

/** Released syntax retains its raw params; new flags use the preferred spelling. */
export function normalizeModelStringFlags(
  value: string,
  flags: StringFlags,
  parse: (params: RawModelprinterParams) => unknown,
  omittedFlags: readonly string[],
): string {
  const tokens = splitModelStringTokens(value)
  if (
    !tokens.slice(1).some((token) => Object.hasOwn(flags, token.toLowerCase()))
  )
    return value

  // Validate before removing defaults, so conflicting or repeated selectors
  // cannot disappear during normalization.
  const expanded = expandModelStringFlags(value, flags)
  parse(parseModelStringParams(expanded))
  const preferred = new Map(
    Object.entries(flags).map(([flag, selector]) => [selector, flag]),
  )
  const omitted = new Set(omittedFlags.map((flag) => flags[flag]!))
  return splitModelStringTokens(expanded)
    .flatMap((token, index) => {
      if (index === 0) return [token.toLowerCase()]
      const lower = token.toLowerCase()
      if (omitted.has(lower)) return []
      return [preferred.get(lower) ?? token]
    })
    .join("_")
}
