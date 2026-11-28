import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pneumaticLubricatorModelDefinitionSchema } from "./schema"

const lengths = {
  npt: "portNominal",
  bowlod: "bowlOuterDiameter",
  h: "height",
  headw: "headWidth",
  headd: "headDepth",
  domeod: "domeOuterDiameter",
  domeh: "domeHeight",
  holep: "holePitch",
  holed: "holeDiameter",
} as const

export function parsePneumaticLubricatorModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "pneumaticlubricator" ||
    tokens[0]?.toLowerCase() !== "pneumaticlubricator"
  ) {
    throw new Error("Expected pneumaticlubricator without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pneumaticlubricator" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pneumaticlubricator`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "sightdome") {
      if (Object.hasOwn(props, "sightDome")) {
        throw new Error("Duplicate pneumaticlubricator sightdome flag")
      }
      props.sightDome = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate pneumaticlubricator holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate pneumaticlubricator property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown pneumaticlubricator token "${token}"`)
    }
  }
  return pneumaticLubricatorModelDefinitionSchema.parse(props)
}
