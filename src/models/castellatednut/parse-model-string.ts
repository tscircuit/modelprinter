import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseCastellatedNutMetricThread } from "./normalize"
import { castellatedNutModelDefinitionSchema } from "./schema"

const lengths = {
  af: "acrossFlats",
  h: "height",
  castleod: "castleOuterDiameter",
  castleh: "castleHeight",
  slotw: "slotWidth",
  slotdepth: "slotDepth",
} as const

export function parseCastellatedNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "castellatednut" ||
    tokens[0]?.toLowerCase() !== "castellatednut"
  ) {
    throw new Error("Expected castellatednut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "castellatednut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for castellatednut`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate castellatednut thread size")
      }
      props.threadDiameter = parseCastellatedNutMetricThread(tokenArg)
    } else if (tokenName === "slots") {
      if (!tokenArg) throw new Error(`Missing slot count in "${token}"`)
      if (Object.hasOwn(props, "slots")) {
        throw new Error("Duplicate castellatednut slots")
      }
      props.slots = parseGearInteger(tokenArg, "slots")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate castellatednut property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown castellatednut token "${token}"`)
    }
  }
  return castellatedNutModelDefinitionSchema.parse(props)
}
