import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pinHeatsinkModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  base: "baseThickness",
  h: "height",
  height: "height",
  pinod: "pinOuterDiameter",
  p: "pitch",
  pitch: "pitch",
  hole: "holeDiameter",
  holed: "holeDiameter",
} as const

export function parsePinHeatsinkModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "pinheatsink" || tokens[0]?.toLowerCase() !== "pinheatsink") {
    throw new Error("Expected pinheatsink without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pinheatsink" }
  for (const token of tokens.slice(1)) {
    const gridTuple = token.match(/^grid\(([^,()]+),([^,()]+)\)$/i)
    if (gridTuple) {
      const [, rawX = "", rawY = ""] = gridTuple
      if (Object.hasOwn(props, "gridX")) {
        throw new Error("Duplicate grid(...) in pinheatsink string")
      }
      props.gridX = parseGearInteger(rawX.trim(), "gridX")
      props.gridY = parseGearInteger(rawY.trim(), "gridY")
      continue
    }
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (Object.hasOwn(props, "holePitchX")) {
        throw new Error("Duplicate hp(...) in pinheatsink string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pinheatsink`,
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
      throw new Error(`Unknown pinheatsink token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate pinheatsink property "${property}"`)
    }
    props[property] = parsed
  }
  return pinHeatsinkModelDefinitionSchema.parse(props)
}
