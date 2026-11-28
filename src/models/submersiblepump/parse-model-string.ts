import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { submersiblePumpModelDefinitionSchema } from "./schema"

const lengths = {
  bodyod: "bodyOuterDiameter",
  h: "height",
  outletod: "outletOuterDiameter",
  baseod: "baseOuterDiameter",
  boltcirc: "boltCircleDiameter",
  holed: "holeDiameter",
} as const

export function parseSubmersiblePumpModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "submersiblepump" ||
    tokens[0]?.toLowerCase() !== "submersiblepump"
  ) {
    throw new Error("Expected submersiblepump without an inline value")
  }
  const props: Record<string, unknown> = { fn: "submersiblepump" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for submersiblepump`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "topbarb") {
      if (Object.hasOwn(props, "topBarb")) {
        throw new Error("Duplicate submersiblepump topbarb flag")
      }
      props.topBarb = true
      continue
    }
    if (lower === "basefeet") {
      if (Object.hasOwn(props, "baseFeet")) {
        throw new Error("Duplicate submersiblepump basefeet flag")
      }
      props.baseFeet = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate submersiblepump holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate submersiblepump property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown submersiblepump token "${token}"`)
    }
  }
  return submersiblePumpModelDefinitionSchema.parse(props)
}
