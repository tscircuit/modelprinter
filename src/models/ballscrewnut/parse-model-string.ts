import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ballScrewNutModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  pitch: "pitch",
  p: "pitch",
  od: "outerDiameter",
  l: "length",
  length: "length",
  flangeod: "flangeOuterDiameter",
  pcd: "pcd",
  holed: "holeDiameter",
  hole: "holeDiameter",
} as const

export function parseBallScrewNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "ballscrewnut" ||
    tokens[0]?.toLowerCase() !== "ballscrewnut"
  ) {
    throw new Error("Expected ballscrewnut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "ballscrewnut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for ballscrewnut`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "gothicarch") {
      property = "gothicArch"
      parsed = true
    } else if (lower === "externaltube") {
      property = "externalTube"
      parsed = true
    } else if (lower === "face4hole") {
      property = "face4Hole"
      parsed = true
    } else if (lower === "righthand" || lower === "righthanded") {
      property = "handedness"
      parsed = "right"
    } else if (lower === "lefthand" || lower === "lefthanded") {
      property = "handedness"
      parsed = "left"
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown ballscrewnut token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate ballscrewnut property "${property}"`)
    }
    props[property] = parsed
  }
  return ballScrewNutModelDefinitionSchema.parse(props)
}
