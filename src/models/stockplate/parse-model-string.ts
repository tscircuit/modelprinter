import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { stockPlateModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  t: "thickness",
  thickness: "thickness",
  edger: "edgeRadius",
  edgeradius: "edgeRadius",
} as const

export function parseStockPlateModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "stockplate" || tokens[0]?.toLowerCase() !== "stockplate")
    throw new Error("Expected stockplate without an inline value")
  const props: Record<string, unknown> = { fn: "stockplate" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid stock plate token "${token}"`)
    const name = match[1]!.toLowerCase()
    if (!Object.hasOwn(lengths, name))
      throw new Error(`Unknown stock plate token "${token}"`)
    const property = lengths[name as keyof typeof lengths]
    if (Object.hasOwn(props, property))
      throw new Error(
        `Stock plate property "${property}" is set more than once`,
      )
    props[property] = match[2]!
  }
  return stockPlateModelDefinitionSchema.parse(props)
}
