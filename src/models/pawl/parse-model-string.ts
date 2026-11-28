import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pawlModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  pivotd: "pivotDiameter",
  noseradius: "noseRadius",
} as const

export function parsePawlModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "pawl" || tokens[0]?.toLowerCase() !== "pawl") {
    throw new Error("Expected pawl without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pawl" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pawl`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "pivotbore") {
      property = "pivotBore"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "noseangle") {
        property = "noseAngleDeg"
        parsed = parseGearAngle(tokenArg, "noseangle")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown pawl token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate pawl property "${property}"`)
    }
    props[property] = parsed
  }
  return pawlModelDefinitionSchema.parse(props)
}
