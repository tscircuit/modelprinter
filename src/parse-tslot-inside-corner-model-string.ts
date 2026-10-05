import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "./gear-parameter-schemas"
import type { RawModelprinterParams } from "./parse-model-string"
import { splitModelStringTokens } from "./split-model-string-tokens"
import { tSlotInsideCornerModelDefinitionSchema } from "./tslot-inside-corner-schema"

const lengths = {
  w: "width",
  width: "width",
  leg: "legLength",
  leglength: "legLength",
  t: "thickness",
  thickness: "thickness",
  hole: "holeDiameter",
  holediameter: "holeDiameter",
  offset: "holeOffset",
  holeoffset: "holeOffset",
  bendr: "bendRadius",
  bendradius: "bendRadius",
} as const

export function parseTSlotInsideCornerModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "tslotinsidecorner" || tokens[0]?.toLowerCase() !== raw.fn)
    throw new Error("Expected tslotinsidecorner without an inline value")
  const props: Record<string, unknown> = { fn: "tslotinsidecorner" }
  for (const token of tokens.slice(1)) {
    const [name, value] = parseGearToken(token)
    let property: string
    let parsed: unknown = value
    if (name in lengths) property = lengths[name as keyof typeof lengths]
    else if (name === "holes" || name === "holecount") {
      property = "holeCount"
      parsed = parseGearInteger(value, "holeCount")
    } else if (name === "angle") {
      property = "angle"
      parsed = parseGearAngle(value, "angle")
    } else throw new Error(`Unknown T-slot inside corner token "${token}"`)
    if (property in props)
      throw new Error(`T-slot inside corner property "${property}" is repeated`)
    props[property] = parsed
  }
  return tSlotInsideCornerModelDefinitionSchema.parse(props)
}
