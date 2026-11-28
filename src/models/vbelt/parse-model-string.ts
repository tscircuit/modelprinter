import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { vBeltModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  w: "topWidth",
  width: "topWidth",
  h: "height",
  height: "height",
} as const

export function parseVBeltModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "vbelt" || tokens[0]?.toLowerCase() !== "vbelt") {
    throw new Error("Expected vbelt without an inline value")
  }
  const props: Record<string, unknown> = { fn: "vbelt" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for vbelt`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "customv") {
      property = "customV"
      parsed = true
    } else if (lower === "endless") {
      property = "endless"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "sideangle") {
        property = "sideAngle"
        parsed = parseGearAngle(tokenArg, "sideangle")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown vbelt token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate vbelt property "${property}"`)
    }
    props[property] = parsed
  }
  return vBeltModelDefinitionSchema.parse(props)
}
