import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { eccentricFixtureClampModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  h: "height",
  height: "height",
  bore: "boreDiameter",
  offset: "offset",
  toothdepth: "toothDepth",
  toothpitch: "toothPitch",
  tophex: "topHexAcrossFlats",
} as const

export function parseEccentricFixtureClampModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "eccentricfixtureclamp" ||
    tokens[0]?.toLowerCase() !== "eccentricfixtureclamp"
  ) {
    throw new Error("Expected eccentricfixtureclamp without an inline value")
  }
  const props: Record<string, unknown> = { fn: "eccentricfixtureclamp" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for eccentricfixtureclamp`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(
          `Duplicate eccentricfixtureclamp property "${property}"`,
        )
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown eccentricfixtureclamp token "${token}"`)
    }
  }
  return eccentricFixtureClampModelDefinitionSchema.parse(props)
}
