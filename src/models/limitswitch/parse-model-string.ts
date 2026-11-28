import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { limitSwitchModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  h: "height",
  d: "depth",
  leverl: "leverLength",
  rollerod: "rollerOuterDiameter",
  pivot: "pivotDiameter",
  hole: "holeDiameter",
  hp: "holePitch",
  entryd: "entryDiameter",
  entrypitch: "entryPitch",
} as const

export function parseLimitSwitchModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "limitswitch" || tokens[0]?.toLowerCase() !== "limitswitch") {
    throw new Error("Expected limitswitch without an inline value")
  }
  const props: Record<string, unknown> = { fn: "limitswitch" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for limitswitch`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate limitswitch holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate limitswitch property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown limitswitch token "${token}"`)
    }
  }
  return limitSwitchModelDefinitionSchema.parse(props)
}
