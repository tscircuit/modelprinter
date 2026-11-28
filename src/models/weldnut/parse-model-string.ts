import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseWeldNutMetricThread } from "./normalize"
import { weldNutModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  h: "height",
  projectiond: "projectionDiameter",
  projectionh: "projectionHeight",
  projectionp: "projectionPitch",
} as const

export function parseWeldNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "weldnut" || tokens[0]?.toLowerCase() !== "weldnut") {
    throw new Error("Expected weldnut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "weldnut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for weldnut`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "squarebody") {
      if (Object.hasOwn(props, "squareBody")) {
        throw new Error("Duplicate weldnut squarebody flag")
      }
      props.squareBody = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate weldnut thread size")
      }
      props.threadDiameter = parseWeldNutMetricThread(tokenArg)
    } else if (tokenName === "projections") {
      if (!tokenArg) throw new Error(`Missing projection count in "${token}"`)
      if (Object.hasOwn(props, "projections")) {
        throw new Error("Duplicate weldnut projections")
      }
      props.projections = parseGearInteger(tokenArg, "projections")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate weldnut property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown weldnut token "${token}"`)
    }
  }
  return weldNutModelDefinitionSchema.parse(props)
}
