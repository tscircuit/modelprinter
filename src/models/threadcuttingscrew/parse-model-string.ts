import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { threadCuttingScrewModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  headod: "headOuterDiameter",
  headh: "headHeight",
  flutel: "fluteLength",
  flutew: "fluteWidth",
  flutedepth: "fluteDepth",
} as const

export function parseThreadCuttingScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "threadcuttingscrew" ||
    tokens[0]?.toLowerCase() !== "threadcuttingscrew"
  ) {
    throw new Error("Expected threadcuttingscrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "threadcuttingscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for threadcuttingscrew`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "fullthread") {
      property = "fullThread"
      parsed = true
    } else if (lower === "panhead") {
      property = "panHead"
      parsed = true
    } else if (lower === "phillips") {
      property = "phillips"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "flutes") {
        property = "flutes"
        parsed = parseGearInteger(tokenArg, "flutes")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown threadcuttingscrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate threadcuttingscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return threadCuttingScrewModelDefinitionSchema.parse(props)
}
