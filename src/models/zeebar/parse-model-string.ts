import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { zeeBarModelDefinitionSchema } from "./schema"
const aliases = {
  h: "height",
  upperw: "upperWidth",
  lowerw: "lowerWidth",
  t: "thickness",
  bendr: "bendRadius",
  l: "length",
  height: "height",
  upperwidth: "upperWidth",
  lowerwidth: "lowerWidth",
  thickness: "thickness",
  bendradius: "bendRadius",
  length: "length",
} as const
export function parseZeeBarModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "zeebar" || name?.toLowerCase() !== "zeebar")
    throw new Error("Expected zeebar without inline values")
  const props: Record<string, unknown> = { fn: "zeebar" }
  for (const token of tokens) {
    const [key, value] = parseGearToken(token)
    if (!Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed zeebar token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Repeated zeebar property "${property}"`)
    props[property] = value
  }
  return zeeBarModelDefinitionSchema.parse(props)
}
