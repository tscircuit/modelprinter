import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { splinedShaftModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  rootd: "rootDiameter",
  l: "length",
  toothw: "toothWidth",
  endchamfer: "endChamfer",
} as const

export function parseSplinedShaftModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "splinedshaft" ||
    tokens[0]?.toLowerCase() !== "splinedshaft"
  ) {
    throw new Error("Expected splinedshaft without an inline value")
  }
  const props: Record<string, unknown> = { fn: "splinedshaft" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for splinedshaft`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "straightsided") {
      if (Object.hasOwn(props, "straightSided")) {
        throw new Error("Duplicate splinedshaft straightsided flag")
      }
      props.straightSided = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "teeth") {
      if (!tokenArg) throw new Error(`Missing tooth count in "${token}"`)
      if (Object.hasOwn(props, "teeth")) {
        throw new Error("Duplicate splinedshaft teeth")
      }
      props.teeth = parseGearInteger(tokenArg, "teeth")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate splinedshaft property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown splinedshaft token "${token}"`)
    }
  }
  return splinedShaftModelDefinitionSchema.parse(props)
}
