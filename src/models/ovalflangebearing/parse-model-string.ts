import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ovalFlangeBearingModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  id: "boreDiameter",
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  depth: "depth",
  holepitch: "holePitch",
  p: "holePitch",
  holed: "holeDiameter",
  hole: "holeDiameter",
} as const

export function parseOvalFlangeBearingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "ovalflangebearing" ||
    tokens[0]?.toLowerCase() !== "ovalflangebearing"
  ) {
    throw new Error("Expected ovalflangebearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "ovalflangebearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for ovalflangebearing`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "face2hole") {
      property = "face2Hole"
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
        throw new Error(`Unknown ovalflangebearing token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate ovalflangebearing property "${property}"`)
    }
    props[property] = parsed
  }
  return ovalFlangeBearingModelDefinitionSchema.parse(props)
}
