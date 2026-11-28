import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { groundingBusbarModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  t: "thickness",
  thickness: "thickness",
  bore: "boreDiameter",
  p: "pitch",
  pitch: "pitch",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
} as const

export function parseGroundingBusbarModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "groundingbusbar" ||
    tokens[0]?.toLowerCase() !== "groundingbusbar"
  ) {
    throw new Error("Expected groundingbusbar without an inline value")
  }
  const props: Record<string, unknown> = { fn: "groundingbusbar" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for groundingbusbar`,
      )
    }
    const lower = token.toLowerCase()
    const screwMatch = lower.match(/^screw(m\d+(?:\.\d+)?)$/)
    let property: string
    let parsed: unknown
    if (screwMatch) {
      property = "screwThread"
      parsed = screwMatch[1]
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "bores") {
        property = "bores"
        parsed = parseGearInteger(tokenArg, "bores")
      } else if (tokenName === "mounts") {
        property = "mounts"
        parsed = parseGearInteger(tokenArg, "mounts")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown groundingbusbar token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate groundingbusbar property "${property}"`)
    }
    props[property] = parsed
  }
  return groundingBusbarModelDefinitionSchema.parse(props)
}
