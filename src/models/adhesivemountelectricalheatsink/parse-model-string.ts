import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { adhesiveMountElectricalHeatsinkModelDefinitionSchema } from "./schema"
const lengths = {
  w: "width",
  l: "length",
  h: "height",
  base: "baseThickness",
  fin: "finThickness",
} as const
export function parseAdhesiveMountElectricalHeatsinkModelParams(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "adhesivemountelectricalheatsink" ||
    tokens[0]?.toLowerCase() !== "adhesivemountelectricalheatsink"
  )
    throw new Error(
      "Expected adhesivemountelectricalheatsink without an inline value",
    )
  const props: Record<string, unknown> = {
    fn: "adhesivemountelectricalheatsink",
  }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase(),
      value = match?.[2]
    if (!name || !value) throw new Error(`Invalid heatsink token "${token}"`)
    let property: string,
      parsed: unknown = value
    if (name in lengths) property = lengths[name as keyof typeof lengths]
    else if (name === "fins") {
      property = "finCount"
      if (!/^\d+$/.test(value))
        throw new Error("Fin count requires a unitless integer")
      parsed = Number(value)
    } else throw new Error(`Unknown heatsink token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate heatsink property "${property}"`)
    props[property] = parsed
  }
  return adhesiveMountElectricalHeatsinkModelDefinitionSchema.parse(props)
}
