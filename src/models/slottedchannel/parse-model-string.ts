import { parseGearToken, parseGearInteger } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { slottedChannelModelDefinitionSchema } from "./schema"
const aliases = {
  w: "width",
  h: "height",
  t: "thickness",
  innerr: "innerRadius",
  l: "length",
  slots: "slotCount",
  slotw: "slotWidth",
  slotl: "slotLength",
  pitch: "pitch",
  end: "endOffset",
  width: "width",
  height: "height",
  thickness: "thickness",
  innerradius: "innerRadius",
  length: "length",
  slotcount: "slotCount",
  slotwidth: "slotWidth",
  slotlength: "slotLength",
  endoffset: "endOffset",
} as const
export function parseSlottedChannelModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "slottedchannel" || name?.toLowerCase() !== "slottedchannel")
    throw new Error("Expected slottedchannel without inline values")
  const props: Record<string, unknown> = { fn: "slottedchannel" }
  for (const token of tokens) {
    const [key, value] = parseGearToken(token)
    if (!Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed slottedchannel token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Repeated slottedchannel property "${property}"`)
    props[property] = ["slotCount"].includes(property)
      ? parseGearInteger(value, property)
      : value
  }
  return slottedChannelModelDefinitionSchema.parse(props)
}
