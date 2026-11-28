import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { flatBeltModelDefinitionSchema } from "./schema"

const lengths = {
  l: "pitchLength",
  length: "pitchLength",
  w: "width",
  width: "width",
  h: "thickness",
  t: "thickness",
} as const

export function parseFlatBeltModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "flatbelt" || tokens[0]?.toLowerCase() !== "flatbelt") {
    throw new Error("Expected flatbelt without an inline value")
  }
  const props: Record<string, unknown> = { fn: "flatbelt" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for flatbelt`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "endless") {
      property = "endless"
      parsed = true
    } else if (lower === "rectangular") {
      property = "rectangular"
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
        throw new Error(`Unknown flatbelt token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate flatbelt property "${property}"`)
    }
    props[property] = parsed
  }
  return flatBeltModelDefinitionSchema.parse(props)
}
