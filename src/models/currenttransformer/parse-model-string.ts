import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { currentTransformerModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  d: "depth",
  depth: "depth",
  bore: "boreDiameter",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
} as const

export function parseCurrentTransformerModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "currenttransformer" ||
    tokens[0]?.toLowerCase() !== "currenttransformer"
  ) {
    throw new Error("Expected currenttransformer without an inline value")
  }
  const props: Record<string, unknown> = { fn: "currenttransformer" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for currenttransformer`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "closedring") {
      property = "closedRing"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "terminals") {
        property = "terminals"
        parsed = parseGearInteger(tokenArg, "terminals")
      } else if (tokenName === "tabs") {
        property = "tabs"
        parsed = parseGearInteger(tokenArg, "tabs")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown currenttransformer token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate currenttransformer property "${property}"`)
    }
    props[property] = parsed
  }
  return currentTransformerModelDefinitionSchema.parse(props)
}
