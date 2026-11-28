import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { shieldCanModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  d: "depth",
  h: "height",
  t: "wallThickness",
  tabw: "tabWidth",
  tabh: "tabHeight",
} as const

export function parseShieldCanModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "pcbshieldcan" ||
    tokens[0]?.toLowerCase() !== "pcbshieldcan"
  ) {
    throw new Error("Expected pcbshieldcan without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pcbshieldcan" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pcbshieldcan`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "closedtop" || lower === "openframe") {
      if (Object.hasOwn(props, "topStyle")) {
        throw new Error("Duplicate pcbshieldcan top style flag")
      }
      props.topStyle = lower
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "tabs") {
      if (!tokenArg) throw new Error(`Missing tab count in "${token}"`)
      if (Object.hasOwn(props, "tabs")) {
        throw new Error("Duplicate pcbshieldcan tabs")
      }
      props.tabs = parseGearInteger(tokenArg, "tabs")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate pcbshieldcan property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown pcbshieldcan token "${token}"`)
    }
  }
  return shieldCanModelDefinitionSchema.parse(props)
}
