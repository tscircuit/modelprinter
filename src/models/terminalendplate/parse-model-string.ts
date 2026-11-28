import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { terminalEndPlateModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  t: "thickness",
  thickness: "thickness",
  pinod: "pinOuterDiameter",
  pinp: "pinPitch",
} as const

export function parseTerminalEndPlateModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "terminalendplate" ||
    tokens[0]?.toLowerCase() !== "terminalendplate"
  ) {
    throw new Error("Expected terminalendplate without an inline value")
  }
  const props: Record<string, unknown> = { fn: "terminalendplate" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for terminalendplate`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "steppedterminal") {
      property = "steppedTerminal"
      parsed = true
    } else if (lower === "th35x7.5") {
      property = "th35x75"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "pins") {
        property = "pins"
        parsed = parseGearInteger(tokenArg, "pins")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown terminalendplate token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate terminalendplate property "${property}"`)
    }
    props[property] = parsed
  }
  return terminalEndPlateModelDefinitionSchema.parse(props)
}
