import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pneumaticFilterModelDefinitionSchema } from "./schema"

const lengths = {
  npt: "portNominal",
  bowlod: "bowlOuterDiameter",
  h: "height",
  headw: "headWidth",
  headd: "headDepth",
  holep: "holePitch",
  holed: "holeDiameter",
} as const

export function parsePneumaticFilterModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "pneumaticfilter" ||
    tokens[0]?.toLowerCase() !== "pneumaticfilter"
  ) {
    throw new Error("Expected pneumaticfilter without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pneumaticfilter" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pneumaticfilter`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "bottomdrain") {
      if (Object.hasOwn(props, "bottomDrain")) {
        throw new Error("Duplicate pneumaticfilter bottomdrain flag")
      }
      props.bottomDrain = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate pneumaticfilter holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate pneumaticfilter property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown pneumaticfilter token "${token}"`)
    }
  }
  return pneumaticFilterModelDefinitionSchema.parse(props)
}
