import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { splitPillowBlockModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  l: "length",
  w: "width",
  h: "height",
  slotpitch: "slotPitch",
  slotw: "slotWidth",
  slotl: "slotLength",
} as const

export function parseSplitPillowBlockModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "splitpillowblock" ||
    tokens[0]?.toLowerCase() !== "splitpillowblock"
  ) {
    throw new Error("Expected splitpillowblock without an inline value")
  }
  const props: Record<string, unknown> = { fn: "splitpillowblock" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for splitpillowblock`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "base2slot") {
      if (Object.hasOwn(props, "base2Slot")) {
        throw new Error("Duplicate splitpillowblock base2slot flag")
      }
      props.base2Slot = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate splitpillowblock property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown splitpillowblock token "${token}"`)
    }
  }
  return splitPillowBlockModelDefinitionSchema.parse(props)
}
