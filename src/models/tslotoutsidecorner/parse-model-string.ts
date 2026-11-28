import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tSlotOutsideCornerModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  leg: "legLength",
  leglength: "legLength",
  t: "thickness",
  thickness: "thickness",
  hole: "holeDiameter",
  holediameter: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
  offset: "holeOffset",
  holeoffset: "holeOffset",
  bendr: "bendRadius",
  bendradius: "bendRadius",
} as const

export function parseTSlotOutsideCornerModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "tslotoutsidecorner" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected tslotoutsidecorner without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "tslotoutsidecorner" }
  for (const token of tokens.slice(1)) {
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown = tokenArg
    if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length argument in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
    } else if (tokenName === "holes" || tokenName === "holecount") {
      property = "holeCount"
      parsed = parseGearInteger(tokenArg, "holeCount")
    } else if (tokenName === "angle") {
      property = "angle"
      parsed = parseGearAngle(tokenArg, "angle")
    } else {
      throw new Error(`Unknown T-slot outside corner token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(
        `T-slot outside corner property "${property}" is repeated`,
      )
    }
    props[property] = parsed
  }
  return tSlotOutsideCornerModelDefinitionSchema.parse(props)
}
