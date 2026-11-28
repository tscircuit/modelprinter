import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { flushPullModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  h: "height",
  d: "depth",
  wall: "wallThickness",
  flange: "flangeWidth",
  corner: "cornerRadius",
  hole: "holeDiameter",
  hp: "holePitch",
} as const

export function parseFlushPullModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "flushpull" || tokens[0]?.toLowerCase() !== "flushpull") {
    throw new Error("Expected flushpull without an inline value")
  }
  const props: Record<string, unknown> = { fn: "flushpull" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for flushpull`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing hole count in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate flushpull holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate flushpull property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown flushpull token "${token}"`)
    }
  }
  return flushPullModelDefinitionSchema.parse(props)
}
