import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { leadScrewNutModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  id: "boreDiameter",
  od: "bodyOuterDiameter",
  bodyod: "bodyOuterDiameter",
  l: "length",
  length: "length",
  flangeod: "flangeOuterDiameter",
  threadpitch: "threadPitch",
  lead: "lead",
  pcd: "pitchCircleDiameter",
  boltpcd: "pitchCircleDiameter",
  holed: "holeDiameter",
  hole: "holeDiameter",
} as const

export function parseLeadScrewNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "leadscrewnut" ||
    tokens[0]?.toLowerCase() !== "leadscrewnut"
  ) {
    throw new Error("Expected leadscrewnut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "leadscrewnut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for leadscrewnut`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "face4hole") {
      property = "face4Hole"
      parsed = true
    } else if (/^tr(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "trapezoidalThread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "starts") {
        property = "starts"
        parsed = parseGearInteger(tokenArg, "starts")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown leadscrewnut token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate leadscrewnut property "${property}"`)
    }
    props[property] = parsed
  }
  return leadScrewNutModelDefinitionSchema.parse(props)
}
