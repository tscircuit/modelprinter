import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { wallCaseModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  wall: "wallThickness",
  corner: "cornerRadius",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hpx: "holePitchX",
  hpy: "holePitchY",
} as const

export function parseWallCaseModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "wallcase" || tokens[0]?.toLowerCase() !== "wallcase") {
    throw new Error("Expected wallcase without an inline value")
  }
  const props: Record<string, unknown> = { fn: "wallcase" }
  for (const token of tokens.slice(1)) {
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (
        Object.hasOwn(props, "holePitchX") ||
        Object.hasOwn(props, "holePitchY")
      ) {
        throw new Error("Duplicate hp(...) in wallcase string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for wallcase`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "leftpivotdoor") {
      property = "leftPivotDoor"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "mounts") {
        property = "mounts"
        parsed = parseGearInteger(tokenArg, "mounts")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown wallcase token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate wallcase property "${property}"`)
    }
    props[property] = parsed
  }
  return wallCaseModelDefinitionSchema.parse(props)
}
