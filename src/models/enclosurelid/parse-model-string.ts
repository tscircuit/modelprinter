import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { enclosureLidModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  t: "thickness",
  thickness: "thickness",
  corner: "cornerRadius",
  rimw: "rimWidth",
  rimdepth: "rimDepth",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hpx: "holePitchX",
  hpy: "holePitchY",
} as const

export function parseEnclosureLidModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "enclosurelid" ||
    tokens[0]?.toLowerCase() !== "enclosurelid"
  ) {
    throw new Error("Expected enclosurelid without an inline value")
  }
  const props: Record<string, unknown> = { fn: "enclosurelid" }
  for (const token of tokens.slice(1)) {
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (
        Object.hasOwn(props, "holePitchX") ||
        Object.hasOwn(props, "holePitchY")
      ) {
        throw new Error("Duplicate hp(...) in enclosurelid string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for enclosurelid`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
    if (tokenName === "holes") {
      property = "holes"
      parsed = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    } else {
      throw new Error(`Unknown enclosurelid token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate enclosurelid property "${property}"`)
    }
    props[property] = parsed
  }
  return enclosureLidModelDefinitionSchema.parse(props)
}
