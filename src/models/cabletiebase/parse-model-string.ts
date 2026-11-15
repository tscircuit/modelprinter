import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cableTieBaseModelDefinitionSchema } from "./schema"
const aliases = {
  w: "width",
  d: "depth",
  h: "height",
  slotw: "slotWidth",
  sloth: "slotHeight",
  floor: "floorThickness",
  hole: "holeDiameter",
  width: "width",
  depth: "depth",
  height: "height",
  slotwidth: "slotWidth",
  slotheight: "slotHeight",
  floorthickness: "floorThickness",
  holediameter: "holeDiameter",
} as const
export function parseCableTieBaseModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "cabletiebase" || name?.toLowerCase() !== "cabletiebase")
    throw new Error("Expected cabletiebase without inline values")
  const props: Record<string, unknown> = { fn: "cabletiebase" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase(),
      value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed cabletiebase token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate cabletiebase property "${property}"`)
    props[property] = value
  }
  return cableTieBaseModelDefinitionSchema.parse(props)
}
