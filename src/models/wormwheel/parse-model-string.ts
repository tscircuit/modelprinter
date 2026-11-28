import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { wormWheelModelDefinitionSchema } from "./schema"

const lengths = {
  axialmodule: "axialModule",
  bore: "boreDiameter",
  id: "boreDiameter",
  w: "width",
  width: "width",
  wormpd: "wormPitchDiameter",
  keyw: "keyWidth",
} as const

export function parseWormWheelModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "wormwheel" || tokens[0]?.toLowerCase() !== "wormwheel") {
    throw new Error("Expected wormwheel without an inline value")
  }
  const props: Record<string, unknown> = { fn: "wormwheel" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for wormwheel`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "righthand") {
      property = "rightHand"
      parsed = true
    } else if (lower === "lefthand") {
      property = "rightHand"
      parsed = false
    } else if (lower === "keyway") {
      property = "keyway"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "teeth" || tokenName === "starts") {
        property = tokenName
        parsed = parseGearInteger(tokenArg, tokenName)
      } else if (tokenName === "axialpa") {
        property = "axialPressureAngle"
        parsed = parseGearAngle(tokenArg, "axialpa")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown wormwheel token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate wormwheel property "${property}"`)
    }
    props[property] = parsed
  }
  return wormWheelModelDefinitionSchema.parse(props)
}
