import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseClinchNutMetricThread } from "./normalize"
import { clinchNutModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  h: "height",
  neckd: "neckDiameter",
  neckh: "neckHeight",
  flangeod: "flangeOuterDiameter",
  flangeh: "flangeHeight",
  serrationdepth: "serrationDepth",
} as const

export function parseClinchNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "clinchnut" || tokens[0]?.toLowerCase() !== "clinchnut") {
    throw new Error("Expected clinchnut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "clinchnut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for clinchnut`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate clinchnut thread size")
      }
      props.threadDiameter = parseClinchNutMetricThread(tokenArg)
    } else if (tokenName === "serrations") {
      if (!tokenArg) throw new Error(`Missing serration count in "${token}"`)
      if (Object.hasOwn(props, "serrations")) {
        throw new Error("Duplicate clinchnut serrations")
      }
      props.serrations = parseGearInteger(tokenArg, "serrations")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate clinchnut property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown clinchnut token "${token}"`)
    }
  }
  return clinchNutModelDefinitionSchema.parse(props)
}
