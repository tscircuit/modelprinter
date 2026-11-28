import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ballSplineNutModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  od: "outerDiameter",
  l: "length",
  length: "length",
  flangeod: "flangeOuterDiameter",
  pcd: "pcd",
  holed: "holeDiameter",
  hole: "holeDiameter",
} as const

export function parseBallSplineNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "ballsplinenut" ||
    tokens[0]?.toLowerCase() !== "ballsplinenut"
  ) {
    throw new Error("Expected ballsplinenut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "ballsplinenut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for ballsplinenut`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "face4hole") {
      property = "face4Hole"
      parsed = true
    } else if (lower === "internalreturn") {
      property = "internalReturn"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "racecount") {
        property = "raceCount"
        parsed = parseGearInteger(tokenArg, "raceCount")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown ballsplinenut token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate ballsplinenut property "${property}"`)
    }
    props[property] = parsed
  }
  return ballSplineNutModelDefinitionSchema.parse(props)
}
