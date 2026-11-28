import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { inductiveSensorModelDefinitionSchema } from "./schema"

const lengths = {
  threadod: "threadOuterDiameter",
  threadpitch: "threadPitch",
  l: "length",
  faceod: "faceOuterDiameter",
  cableod: "cableOuterDiameter",
  cablel: "cableLength",
} as const

export function parseInductiveSensorModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "inductivesensor" ||
    tokens[0]?.toLowerCase() !== "inductivesensor"
  ) {
    throw new Error("Expected inductivesensor without an inline value")
  }
  const props: Record<string, unknown> = { fn: "inductivesensor" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for inductivesensor`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "flushfront") {
      if (Object.hasOwn(props, "flushFront")) {
        throw new Error("Duplicate inductivesensor flushfront flag")
      }
      props.flushFront = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "nuts") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "nuts")) {
        throw new Error("Duplicate inductivesensor nuts")
      }
      props.nuts = parseGearInteger(tokenArg, "nuts")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate inductivesensor property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown inductivesensor token "${token}"`)
    }
  }
  return inductiveSensorModelDefinitionSchema.parse(props)
}
