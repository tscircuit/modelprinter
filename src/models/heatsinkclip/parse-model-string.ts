import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { heatsinkClipModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  l: "length",
  h: "height",
  t: "stripThickness",
  hookd: "hookDepth",
} as const

export function parseHeatsinkClipModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "heatsinkclip" ||
    tokens[0]?.toLowerCase() !== "heatsinkclip"
  ) {
    throw new Error("Expected heatsinkclip without an inline value")
  }
  const props: Record<string, unknown> = { fn: "heatsinkclip" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for heatsinkclip`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "springbridge") {
      if (Object.hasOwn(props, "springBridge")) {
        throw new Error("Duplicate heatsinkclip springbridge flag")
      }
      props.springBridge = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate heatsinkclip property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown heatsinkclip token "${token}"`)
    }
  }
  return heatsinkClipModelDefinitionSchema.parse(props)
}
