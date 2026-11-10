import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { teeBeamModelDefinitionSchema } from "./schema"

const aliases = {
  h: "height",
  height: "height",
  w: "width",
  width: "width",
  web: "webThickness",
  webthickness: "webThickness",
  flange: "flangeThickness",
  flangethickness: "flangeThickness",
  rootr: "rootRadius",
  rootradius: "rootRadius",
  l: "length",
  length: "length",
} as const

export function parseTeeBeamModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "teebeam" || name?.toLowerCase() !== "teebeam")
    throw new Error("Expected teebeam without an inline value")

  const props: Record<string, unknown> = { fn: "teebeam" }
  for (const token of tokens) {
    const [key, value] = parseGearToken(token)
    if (!value || !Object.hasOwn(aliases, key))
      throw new Error(`Unknown or malformed teebeam token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Repeated teebeam property "${property}"`)
    props[property] = value
  }
  return teeBeamModelDefinitionSchema.parse(props)
}
