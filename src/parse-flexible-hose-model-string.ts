import { flexibleHoseModelDefinitionSchema } from "./flexible-hose-schema"
import type { RawModelprinterParams } from "./parse-model-string"
import { splitModelStringTokens } from "./split-model-string-tokens"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  l: "length",
  length: "length",
} as const

export function parseFlexibleHoseModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "flexiblehose" || !/^flexiblehose$/i.test(tokens[0]!))
    throw new Error("Expected flexiblehose without an inline value")
  const props: Record<string, unknown> = { fn: "flexiblehose" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!name || !value) throw new Error(`Invalid hose token "${token}"`)
    let property: string
    let parsed: unknown = value
    if (name in lengths) property = lengths[name as keyof typeof lengths]
    else if (name === "shape" || name === "wall" || name === "ends") {
      property = name
      const selector = value.match(/^\(([a-z,]+)\)$/i)
      if (!selector) throw new Error(`Hose ${name} requires parentheses`)
      parsed =
        name === "ends"
          ? selector[1]!.toLowerCase().split(",")
          : selector[1]!.toLowerCase()
    } else throw new Error(`Unknown hose token "${token}"`)
    if (property in props)
      throw new Error(`Hose property "${property}" is set more than once`)
    props[property] = parsed
  }
  return flexibleHoseModelDefinitionSchema.parse(props)
}
