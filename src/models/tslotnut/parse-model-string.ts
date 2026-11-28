import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseTSlotNutMetricThread } from "./normalize"
import { tSlotNutModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  l: "length",
  h: "height",
  topw: "topWidth",
  toph: "topHeight",
} as const

export function parseTSlotNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "tslotnut" || tokens[0]?.toLowerCase() !== "tslotnut") {
    throw new Error("Expected tslotnut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "tslotnut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for tslotnut`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "flatends" || lower === "roundedends") {
      if (Object.hasOwn(props, "endStyle")) {
        throw new Error("Duplicate tslotnut end style flag")
      }
      props.endStyle = lower
      continue
    }
    if (lower === "through" || lower === "blind") {
      if (Object.hasOwn(props, "boreStyle")) {
        throw new Error("Duplicate tslotnut bore style flag")
      }
      props.boreStyle = lower
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate tslotnut thread size")
      }
      props.threadDiameter = parseTSlotNutMetricThread(tokenArg)
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate tslotnut property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown tslotnut token "${token}"`)
    }
  }
  return tSlotNutModelDefinitionSchema.parse(props)
}
