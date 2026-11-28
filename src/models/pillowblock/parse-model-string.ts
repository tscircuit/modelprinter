import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pillowBlockModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  bored: "boreDiameter",
  id: "boreDiameter",
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  slotw: "slotWidth",
  slotwidth: "slotWidth",
  slotl: "slotLength",
  slotlength: "slotLength",
  slotpitch: "slotPitch",
  p: "slotPitch",
  pitch: "slotPitch",
} as const

export function parsePillowBlockModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "pillowblock" || tokens[0]?.toLowerCase() !== "pillowblock") {
    throw new Error("Expected pillowblock without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pillowblock" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pillowblock`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "base2slot") {
      property = "base2Slot"
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
        throw new Error(`Unknown pillowblock token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate pillowblock property "${property}"`)
    }
    props[property] = parsed
  }
  return pillowBlockModelDefinitionSchema.parse(props)
}
