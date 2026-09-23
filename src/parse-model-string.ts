import { splitModelStringTokens } from "./split-model-string-tokens"
export type RawModelprinterParams = {
  fn: string
  string: string
  [key: string]: unknown
}

const parsePart = (part: string) => {
  const match = part.match(/^([a-zA-Z]+)([\(\d\.\+\-].*)?$/)
  if (!match?.[1]) return undefined
  return {
    fn: match[1].toLowerCase(),
    value: match[2],
  }
}

/**
 * Parses a model string into the same sort of raw builder parameters exposed
 * by `fp.string(...).params()`. Function-specific validation happens in
 * `.json()`.
 */
export const parseModelStringParams = (
  definition: string,
): RawModelprinterParams => {
  const normalizedDefinition = definition.trim()
  if (!normalizedDefinition) throw new Error("Model string cannot be empty")

  const parts = splitModelStringTokens(normalizedDefinition)
  const firstPart = parts[0]!
  const first = parsePart(firstPart)

  const params: Record<string, unknown> = {}
  const fn = first?.fn ?? firstPart.toLowerCase()
  params[fn] = true
  params.fn = fn

  if (first?.value) {
    const numericValue = Number.parseFloat(first.value)
    if (Number.isFinite(numericValue)) params.num_pins = numericValue
  }

  for (const part of parts.slice(1)) {
    if (!part) throw new Error("Model strings cannot contain empty tokens")
    const parsed = parsePart(part)
    if (!parsed) throw new Error(`Invalid model string token "${part}"`)
    params[parsed.fn] = parsed.value ?? true
  }

  params.string = normalizedDefinition
  return params as RawModelprinterParams
}
