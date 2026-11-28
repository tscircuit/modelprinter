import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { strapClampModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  w: "width",
  t: "thickness",
  slotl: "slotLength",
  slotw: "slotWidth",
  nosel: "noseLength",
  nosedrop: "noseDrop",
  heell: "heelLength",
  heelh: "heelHeight",
} as const

export function parseStrapClampModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "strapclamp" || tokens[0]?.toLowerCase() !== "strapclamp") {
    throw new Error("Expected strapclamp without an inline value")
  }
  const props: Record<string, unknown> = { fn: "strapclamp" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for strapclamp`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate strapclamp property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown strapclamp token "${token}"`)
    }
  }
  return strapClampModelDefinitionSchema.parse(props)
}
