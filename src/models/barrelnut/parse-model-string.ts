import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseBarrelNutMetricThread } from "./normalize"
import { barrelNutModelDefinitionSchema } from "./schema"

const lengths = {
  d: "outerDiameter",
  od: "outerDiameter",
  l: "length",
  holeoffset: "holeOffset",
  slotw: "slotWidth",
  slotdepth: "slotDepth",
} as const

export function parseBarrelNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "barrelnut" || tokens[0]?.toLowerCase() !== "barrelnut") {
    throw new Error("Expected barrelnut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "barrelnut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for barrelnut`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "transverse") {
      if (Object.hasOwn(props, "transverse")) {
        throw new Error("Duplicate barrelnut transverse flag")
      }
      props.transverse = true
      continue
    }
    if (lower === "slotted") {
      if (Object.hasOwn(props, "slotted")) {
        throw new Error("Duplicate barrelnut slotted flag")
      }
      props.slotted = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate barrelnut thread size")
      }
      props.threadDiameter = parseBarrelNutMetricThread(tokenArg)
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate barrelnut property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown barrelnut token "${token}"`)
    }
  }
  return barrelNutModelDefinitionSchema.parse(props)
}
