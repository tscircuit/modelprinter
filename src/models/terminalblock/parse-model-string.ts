import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { terminalBlockModelDefinitionSchema } from "./schema"

const lengths = {
  p: "pitch",
  pitch: "pitch",
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  wireid: "wireEntryDiameter",
  wireentryd: "wireEntryDiameter",
  tails: "tailLength",
  taill: "tailLength",
  taillength: "tailLength",
} as const

export function parseTerminalBlockModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "terminalblock" ||
    tokens[0]?.toLowerCase() !== "terminalblock"
  ) {
    throw new Error("Expected terminalblock without an inline value")
  }
  const props: Record<string, unknown> = { fn: "terminalblock" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for terminalblock`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "throughhole" || lower === "tht") {
      property = "throughHole"
      parsed = true
    } else if (/^screwm(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "screwThread"
      parsed = lower.slice("screw".length)
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (
        tokenName === "n" ||
        tokenName === "poles" ||
        tokenName === "positions"
      ) {
        if (!/^\d+$/.test(tokenArg)) {
          throw new Error(`Invalid position count token "${token}"`)
        }
        property = "positions"
        parsed = Number(tokenArg)
      } else {
        throw new Error(`Unknown terminalblock token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate terminalblock property "${property}"`)
    }
    props[property] = parsed
  }
  return terminalBlockModelDefinitionSchema.parse(props)
}
