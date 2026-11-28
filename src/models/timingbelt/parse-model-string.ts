import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { timingBeltModelDefinitionSchema } from "./schema"

const lengths = {
  pitch: "pitch",
  p: "pitch",
  w: "width",
  width: "width",
  h: "beltHeight",
  height: "beltHeight",
  length: "pitchLength",
  l: "pitchLength",
} as const

export function parseTimingBeltModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "timingbelt" || tokens[0]?.toLowerCase() !== "timingbelt") {
    throw new Error("Expected timingbelt without an inline value")
  }
  const props: Record<string, unknown> = { fn: "timingbelt" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for timingbelt`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "htd5m") {
      property = "htd5m"
      parsed = true
    } else if (lower === "endless") {
      property = "endless"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "teeth") {
        property = "teeth"
        parsed = parseGearInteger(tokenArg, "teeth")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown timingbelt token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate timingbelt property "${property}"`)
    }
    props[property] = parsed
  }
  return timingBeltModelDefinitionSchema.parse(props)
}
