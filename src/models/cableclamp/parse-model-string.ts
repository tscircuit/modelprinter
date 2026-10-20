import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cableClampModelDefinitionSchema } from "./schema"
const aliases = {
  id: "innerDiameter",
  bandw: "bandWidth",
  t: "thickness",
  tab: "tabLength",
  hole: "holeDiameter",
  innerdiameter: "innerDiameter",
  bandwidth: "bandWidth",
  thickness: "thickness",
  tablength: "tabLength",
  holediameter: "holeDiameter",
} as const
export function parseCableClampModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "cableclamp" || name?.toLowerCase() !== "cableclamp")
    throw new Error("Expected cableclamp without inline values")
  const props: Record<string, unknown> = { fn: "cableclamp" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase(),
      value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed cableclamp token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate cableclamp property "${property}"`)
    props[property] = value
  }
  return cableClampModelDefinitionSchema.parse(props)
}
