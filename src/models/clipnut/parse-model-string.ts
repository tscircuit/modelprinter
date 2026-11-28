import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseClipNutMetricThread } from "./normalize"
import { clipNutModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  l: "length",
  gap: "panelGap",
  strip: "stripThickness",
  holeoffset: "holeOffset",
  barrelod: "barrelOuterDiameter",
  barrelh: "barrelHeight",
} as const

export function parseClipNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "clipnut" || tokens[0]?.toLowerCase() !== "clipnut") {
    throw new Error("Expected clipnut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "clipnut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for clipnut`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "uform") {
      if (Object.hasOwn(props, "uForm")) {
        throw new Error("Duplicate clipnut uform flag")
      }
      props.uForm = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate clipnut thread size")
      }
      props.threadDiameter = parseClipNutMetricThread(tokenArg)
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate clipnut property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown clipnut token "${token}"`)
    }
  }
  return clipNutModelDefinitionSchema.parse(props)
}
