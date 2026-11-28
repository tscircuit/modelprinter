import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { vRollerBearingModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  od: "outerDiameter",
  w: "width",
  groovedepth: "grooveDepth",
} as const

export function parseVRollerBearingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "vrollerbearing" ||
    tokens[0]?.toLowerCase() !== "vrollerbearing"
  ) {
    throw new Error("Expected vrollerbearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "vrollerbearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for vrollerbearing`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "vgroove") {
      if (Object.hasOwn(props, "vGroove")) {
        throw new Error("Duplicate vrollerbearing vgroove flag")
      }
      props.vGroove = true
      continue
    }
    if (lower === "boremount") {
      if (Object.hasOwn(props, "boreMount")) {
        throw new Error("Duplicate vrollerbearing boremount flag")
      }
      props.boreMount = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "angle") {
      if (!tokenArg) throw new Error(`Missing angle value in "${token}"`)
      if (Object.hasOwn(props, "grooveAngle")) {
        throw new Error("Duplicate vrollerbearing angle")
      }
      props.grooveAngle = parseGearAngle(tokenArg, "angle")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate vrollerbearing property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown vrollerbearing token "${token}"`)
    }
  }
  return vRollerBearingModelDefinitionSchema.parse(props)
}
