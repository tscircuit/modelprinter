import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { multiChannelPanelModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  t: "thickness",
  thickness: "thickness",
  skint: "skinThickness",
  webt: "webThickness",
  pitch: "pitch",
  p: "pitch",
} as const

export function parseMultiChannelPanelModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "multichannelpanel" ||
    tokens[0]?.toLowerCase() !== "multichannelpanel"
  ) {
    throw new Error("Expected multichannelpanel without an inline value")
  }
  const props: Record<string, unknown> = { fn: "multichannelpanel" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for multichannelpanel`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
    if (tokenName === "channels") {
      property = "channels"
      parsed = parseGearInteger(tokenArg, "channels")
    } else if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    } else {
      throw new Error(`Unknown multichannelpanel token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate multichannelpanel property "${property}"`)
    }
    props[property] = parsed
  }
  return multiChannelPanelModelDefinitionSchema.parse(props)
}
