import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { omniWheelModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  w: "width",
  width: "width",
  bore: "boreDiameter",
  keyw: "keyWidth",
} as const

export function parseOmniWheelModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "omniwheel" || tokens[0]?.toLowerCase() !== "omniwheel") {
    throw new Error("Expected omniwheel without an inline value")
  }
  const props: Record<string, unknown> = { fn: "omniwheel" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for omniwheel`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "keyway") {
      property = "keyway"
      parsed = true
    } else if (lower === "tangentialrollers") {
      property = "tangentialRollers"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "rollers") {
        property = "rollers"
        parsed = parseGearInteger(tokenArg, "rollers")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown omniwheel token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate omniwheel property "${property}"`)
    }
    props[property] = parsed
  }
  return omniWheelModelDefinitionSchema.parse(props)
}
