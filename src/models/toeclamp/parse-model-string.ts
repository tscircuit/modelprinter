import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { toeClampModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  w: "width",
  h: "height",
  toel: "toeLength",
  toeh: "toeHeight",
  mountslotw: "mountSlotWidth",
  mountslotl: "mountSlotLength",
  slotcenter: "slotCenter",
} as const

export function parseToeClampModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "toeclamp" || tokens[0]?.toLowerCase() !== "toeclamp") {
    throw new Error("Expected toeclamp without an inline value")
  }
  const props: Record<string, unknown> = { fn: "toeclamp" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for toeclamp`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate toeclamp property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown toeclamp token "${token}"`)
    }
  }
  return toeClampModelDefinitionSchema.parse(props)
}
