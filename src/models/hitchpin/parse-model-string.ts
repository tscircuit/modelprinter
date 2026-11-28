import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { hitchPinModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  diameter: "diameter",
  l: "workingLength",
  length: "workingLength",
  workingl: "workingLength",
  handlel: "handleLength",
  handlelength: "handleLength",
  bendr: "bendRadius",
  bendradius: "bendRadius",
  hole: "crossHoleDiameter",
  holed: "crossHoleDiameter",
  crossholed: "crossHoleDiameter",
  holeoffset: "crossHoleOffset",
  crossholeoffset: "crossHoleOffset",
  chamfer: "tipChamfer",
  tipchamfer: "tipChamfer",
} as const

export function parseHitchPinModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "hitchpin" || tokens[0]?.toLowerCase() !== "hitchpin") {
    throw new Error("Expected hitchpin without an inline value")
  }
  const props: Record<string, unknown> = { fn: "hitchpin" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for hitchpin`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "benthead" || lower === "bent") {
      property = "bentHead"
      parsed = true
    } else if (lower === "chamfertip") {
      property = "chamferTip"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown hitchpin token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate hitchpin property "${property}"`)
    }
    props[property] = parsed
  }
  return hitchPinModelDefinitionSchema.parse(props)
}
