import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { toroidalCoreModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  id: "innerDiameter",
  h: "height",
  height: "height",
  edger: "edgeRadius",
} as const

export function parseToroidalCoreModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "toroidalcore" ||
    tokens[0]?.toLowerCase() !== "toroidalcore"
  ) {
    throw new Error("Expected toroidalcore without an inline value")
  }
  const props: Record<string, unknown> = { fn: "toroidalcore" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for toroidalcore`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "roundedrectangle") {
      property = "roundedRectangle"
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
        throw new Error(`Unknown toroidalcore token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate toroidalcore property "${property}"`)
    }
    props[property] = parsed
  }
  return toroidalCoreModelDefinitionSchema.parse(props)
}
