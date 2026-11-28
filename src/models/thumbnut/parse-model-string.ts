import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseThumbNutMetricThread } from "./normalize"
import { thumbNutModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  h: "height",
  knurlp: "knurlPitch",
  chamfer: "chamfer",
} as const

export function parseThumbNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "thumbnut" || tokens[0]?.toLowerCase() !== "thumbnut") {
    throw new Error("Expected thumbnut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "thumbnut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for thumbnut`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "through" || lower === "blind") {
      if (Object.hasOwn(props, "boreStyle")) {
        throw new Error("Duplicate thumbnut bore style flag")
      }
      props.boreStyle = lower
      continue
    }
    if (lower === "straightknurl" || lower === "diamondknurl") {
      if (Object.hasOwn(props, "knurlStyle")) {
        throw new Error("Duplicate thumbnut knurl style flag")
      }
      props.knurlStyle = lower
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate thumbnut thread size")
      }
      props.threadDiameter = parseThumbNutMetricThread(tokenArg)
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate thumbnut property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown thumbnut token "${token}"`)
    }
  }
  return thumbNutModelDefinitionSchema.parse(props)
}
