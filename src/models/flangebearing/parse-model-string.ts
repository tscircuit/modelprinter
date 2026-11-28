import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { flangeBearingModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  bored: "boreDiameter",
  id: "boreDiameter",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  depth: "depth",
  d: "depth",
  holegridx: "holeGridX",
  hpx: "holeGridX",
  holegridy: "holeGridY",
  hpy: "holeGridY",
  holed: "holeDiameter",
  hole: "holeDiameter",
} as const

export function parseFlangeBearingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "flangebearing" ||
    tokens[0]?.toLowerCase() !== "flangebearing"
  ) {
    throw new Error("Expected flangebearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "flangebearing" }
  for (const token of tokens.slice(1)) {
    const gridTuple = token.match(/^holegrid\(([^,()]+),([^,()]+)\)$/i)
    if (gridTuple) {
      const [, rawX = "", rawY = ""] = gridTuple
      if (
        Object.hasOwn(props, "holeGridX") ||
        Object.hasOwn(props, "holeGridY")
      ) {
        throw new Error("Duplicate holegrid in flangebearing string")
      }
      props.holeGridX = rawX.trim()
      props.holeGridY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for flangebearing`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "face4hole") {
      property = "face4Hole"
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
        throw new Error(`Unknown flangebearing token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate flangebearing property "${property}"`)
    }
    props[property] = parsed
  }
  return flangeBearingModelDefinitionSchema.parse(props)
}
