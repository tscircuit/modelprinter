import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { terminalJumperModelDefinitionSchema } from "./schema"

const lengths = {
  p: "pitch",
  pitch: "pitch",
  t: "thickness",
  thickness: "thickness",
  stripw: "stripWidth",
  prongw: "prongWidth",
  prongl: "prongLength",
} as const

export function parseTerminalJumperModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "terminaljumper" ||
    tokens[0]?.toLowerCase() !== "terminaljumper"
  ) {
    throw new Error("Expected terminaljumper without an inline value")
  }
  const props: Record<string, unknown> = { fn: "terminaljumper" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for terminaljumper`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "comb") {
      property = "comb"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "n" || tokenName === "poles") {
        property = "poles"
        parsed = parseGearInteger(tokenArg, tokenName)
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown terminaljumper token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate terminaljumper property "${property}"`)
    }
    props[property] = parsed
  }
  return terminalJumperModelDefinitionSchema.parse(props)
}
