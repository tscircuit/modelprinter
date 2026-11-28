import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { transistorHeatsinkModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  d: "depth",
  depth: "depth",
  t: "thickness",
  thickness: "thickness",
  devicehole: "deviceHoleDiameter",
  holez: "holeZ",
  tabhole: "tabHoleDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
} as const

export function parseTransistorHeatsinkModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "transistorheatsink" ||
    tokens[0]?.toLowerCase() !== "transistorheatsink"
  ) {
    throw new Error("Expected transistorheatsink without an inline value")
  }
  const props: Record<string, unknown> = { fn: "transistorheatsink" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for transistorheatsink`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "ushapedwings") {
      property = "uShapedWings"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "tabs") {
        property = "tabs"
        parsed = parseGearInteger(tokenArg, "tabs")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown transistorheatsink token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate transistorheatsink property "${property}"`)
    }
    props[property] = parsed
  }
  return transistorHeatsinkModelDefinitionSchema.parse(props)
}
