import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { beltClampModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  h: "height",
  height: "height",
  pitch: "pitch",
  p: "pitch",
  holed: "holeDiameter",
  hole: "holeDiameter",
  holepitch: "holePitch",
  hp: "holePitch",
} as const

export function parseBeltClampModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "beltclamp" || tokens[0]?.toLowerCase() !== "beltclamp") {
    throw new Error("Expected beltclamp without an inline value")
  }
  const props: Record<string, unknown> = { fn: "beltclamp" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for beltclamp`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "htd5m") {
      property = "htd5m"
      parsed = true
    } else if (lower === "base2hole") {
      property = "base2Hole"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown beltclamp token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate beltclamp property "${property}"`)
    }
    props[property] = parsed
  }
  return beltClampModelDefinitionSchema.parse(props)
}
