import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { shelfSupportClipModelDefinitionSchema } from "./schema"

const lengths = {
  h: "height",
  w: "width",
  l: "length",
  t: "thickness",
  pitch: "hookPitch",
  hookw: "hookWidth",
  hookh: "hookHeight",
  hookdepth: "hookDepth",
  throat: "throat",
  ledgel: "ledgeLength",
} as const

export function parseShelfSupportClipModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "shelfsupportclip" ||
    tokens[0]?.toLowerCase() !== "shelfsupportclip"
  ) {
    throw new Error("Expected shelfsupportclip without an inline value")
  }
  const props: Record<string, unknown> = { fn: "shelfsupportclip" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for shelfsupportclip`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "hooks") {
      if (!tokenArg) throw new Error(`Missing hook count in "${token}"`)
      if (Object.hasOwn(props, "hooks")) {
        throw new Error("Duplicate shelfsupportclip hooks")
      }
      props.hooks = parseGearInteger(tokenArg, "hooks")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate shelfsupportclip property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown shelfsupportclip token "${token}"`)
    }
  }
  return shelfSupportClipModelDefinitionSchema.parse(props)
}
