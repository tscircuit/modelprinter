import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { sheetMetalScrewModelDefinitionSchema } from "./schema"

const lengths = {
  threadpitch: "threadPitch",
  l: "length",
  length: "length",
} as const

export function parseSheetMetalScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "sheetmetalscrew" ||
    tokens[0]?.toLowerCase() !== "sheetmetalscrew"
  ) {
    throw new Error("Expected sheetmetalscrew without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "sheetmetalscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for sheetmetalscrew`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "iso7049") {
      property = "iso7049"
      parsed = true
    } else if (lower === "righthanded") {
      property = "rightHanded"
      parsed = true
    } else if (lower === "lefthanded") {
      property = "rightHanded"
      parsed = false
    } else if (lower === "typec") {
      property = "typeC"
      parsed = true
    } else if (lower === "phillips") {
      property = "phillips"
      parsed = true
    } else if (/^st(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "tappingSize"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown sheetmetalscrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate sheetmetalscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return sheetMetalScrewModelDefinitionSchema.parse(props)
}
