import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ballSplineShaftModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  d: "outerDiameter",
  l: "length",
  length: "length",
  endchamfer: "endChamfer",
} as const

export function parseBallSplineShaftModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "ballsplineshaft" ||
    tokens[0]?.toLowerCase() !== "ballsplineshaft"
  ) {
    throw new Error("Expected ballsplineshaft without an inline value")
  }
  const props: Record<string, unknown> = { fn: "ballsplineshaft" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for ballsplineshaft`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "roundballrace") {
      property = "roundBallRace"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "grooves") {
        property = "grooves"
        parsed = parseGearInteger(tokenArg, "grooves")
      } else if (tokenName === "racecount") {
        property = "raceCount"
        parsed = parseGearInteger(tokenArg, "raceCount")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown ballsplineshaft token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate ballsplineshaft property "${property}"`)
    }
    props[property] = parsed
  }
  return ballSplineShaftModelDefinitionSchema.parse(props)
}
