import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { roundFlangeBearingModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  id: "boreDiameter",
  od: "outerDiameter",
  depth: "depth",
  pcd: "pitchCircleDiameter",
  boltpcd: "pitchCircleDiameter",
  holed: "holeDiameter",
  hole: "holeDiameter",
} as const

export function parseRoundFlangeBearingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "roundflangebearing" ||
    tokens[0]?.toLowerCase() !== "roundflangebearing"
  ) {
    throw new Error("Expected roundflangebearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "roundflangebearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for roundflangebearing`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "face4hole") {
      property = "face4Hole"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown roundflangebearing token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate roundflangebearing property "${property}"`)
    }
    props[property] = parsed
  }
  return roundFlangeBearingModelDefinitionSchema.parse(props)
}
