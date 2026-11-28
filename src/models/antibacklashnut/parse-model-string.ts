import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { antiBacklashNutModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  od: "outerDiameter",
  l: "length",
  length: "length",
  threadpitch: "threadPitch",
  lead: "lead",
  flangeod: "flangeOuterDiameter",
  pcd: "pcd",
  holed: "holeDiameter",
  hole: "holeDiameter",
} as const

export function parseAntiBacklashNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "antibacklashnut" ||
    tokens[0]?.toLowerCase() !== "antibacklashnut"
  ) {
    throw new Error("Expected antibacklashnut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "antibacklashnut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for antibacklashnut`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "face2hole") {
      property = "face2Hole"
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
        throw new Error(`Unknown antibacklashnut token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate antibacklashnut property "${property}"`)
    }
    props[property] = parsed
  }
  return antiBacklashNutModelDefinitionSchema.parse(props)
}
