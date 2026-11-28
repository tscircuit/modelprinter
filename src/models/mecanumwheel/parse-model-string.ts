import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { mecanumWheelModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  w: "width",
  width: "width",
  bore: "boreDiameter",
  keyw: "keyWidth",
} as const

export function parseMecanumWheelModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "mecanumwheel" ||
    tokens[0]?.toLowerCase() !== "mecanumwheel"
  ) {
    throw new Error("Expected mecanumwheel without an inline value")
  }
  const props: Record<string, unknown> = { fn: "mecanumwheel" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for mecanumwheel`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "keyway") {
      property = "keyway"
      parsed = true
    } else if (lower === "righthand" || lower === "righthanded") {
      property = "handedness"
      parsed = "right"
    } else if (lower === "lefthand" || lower === "lefthanded") {
      property = "handedness"
      parsed = "left"
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "rollers") {
        property = "rollers"
        parsed = parseGearInteger(tokenArg, "rollers")
      } else if (tokenName === "angle") {
        property = "rollerAngleDeg"
        parsed = parseGearAngle(tokenArg, "angle")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown mecanumwheel token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate mecanumwheel property "${property}"`)
    }
    props[property] = parsed
  }
  return mecanumWheelModelDefinitionSchema.parse(props)
}
