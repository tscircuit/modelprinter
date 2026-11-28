import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { rollerCatchModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  d: "depth",
  h: "height",
  roller: "rollerDiameter",
  gap: "rollerGap",
  strikew: "strikeWidth",
  hole: "holeDiameter",
  hp: "holePitch",
} as const

export function parseRollerCatchModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "rollercatch" || tokens[0]?.toLowerCase() !== "rollercatch") {
    throw new Error("Expected rollercatch without an inline value")
  }
  const props: Record<string, unknown> = { fn: "rollercatch" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for rollercatch`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate rollercatch property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown rollercatch token "${token}"`)
    }
  }
  return rollerCatchModelDefinitionSchema.parse(props)
}
