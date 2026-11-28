import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { hydraulicSpinOnFilterModelDefinitionSchema } from "./schema"

const lengths = {
  canod: "canOuterDiameter",
  h: "height",
  npt: "portNominal",
  headw: "headWidth",
  headd: "headDepth",
  cand: "canThreadDiameter",
  canpitch: "canThreadPitch",
  holep: "holePitch",
  holed: "holeDiameter",
} as const

export function parseHydraulicSpinOnFilterModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "hydraulicspinonfilter" ||
    tokens[0]?.toLowerCase() !== "hydraulicspinonfilter"
  ) {
    throw new Error("Expected hydraulicspinonfilter without an inline value")
  }
  const props: Record<string, unknown> = { fn: "hydraulicspinonfilter" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for hydraulicspinonfilter`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "headbolt") {
      if (Object.hasOwn(props, "headBolt")) {
        throw new Error("Duplicate hydraulicspinonfilter headbolt flag")
      }
      props.headBolt = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate hydraulicspinonfilter holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(
          `Duplicate hydraulicspinonfilter property "${property}"`,
        )
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown hydraulicspinonfilter token "${token}"`)
    }
  }
  return hydraulicSpinOnFilterModelDefinitionSchema.parse(props)
}
