import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { flatBeltPulleyModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  bore: "boreDiameter",
  w: "width",
  width: "width",
  keyw: "keyWidth",
} as const

export function parseFlatBeltPulleyModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "flatbeltpulley" ||
    tokens[0]?.toLowerCase() !== "flatbeltpulley"
  ) {
    throw new Error("Expected flatbeltpulley without an inline value")
  }
  const props: Record<string, unknown> = { fn: "flatbeltpulley" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for flatbeltpulley`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "flatrim") {
      property = "flatRim"
      parsed = true
    } else if (lower === "keyway") {
      property = "keyway"
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
        throw new Error(`Unknown flatbeltpulley token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate flatbeltpulley property "${property}"`)
    }
    props[property] = parsed
  }
  return flatBeltPulleyModelDefinitionSchema.parse(props)
}
