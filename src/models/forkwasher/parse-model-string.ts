import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { forkWasherModelDefinitionSchema } from "./schema"

const aliases = {
  slotw: "slotWidth",
  slotwidth: "slotWidth",
  slotl: "slotLength",
  slotlength: "slotLength",
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  h: "thickness",
  t: "thickness",
  thickness: "thickness",
} as const

export function parseForkWasherModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "forkwasher" || name?.toLowerCase() !== "forkwasher")
    throw new Error("Expected forkwasher without an inline value")

  const props: Record<string, unknown> = { fn: "forkwasher" }
  for (const token of tokens) {
    const [key, value] = parseGearToken(token)
    if (!value || !Object.hasOwn(aliases, key))
      throw new Error(`Unknown or malformed forkwasher token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Repeated forkwasher property "${property}"`)
    props[property] = value
  }
  return forkWasherModelDefinitionSchema.parse(props)
}
