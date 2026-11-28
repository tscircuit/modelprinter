import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { splitCaseModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  wall: "wallThickness",
  wallt: "wallThickness",
  corner: "cornerRadius",
  cornerr: "cornerRadius",
  split: "splitHeight",
  splith: "splitHeight",
  seamlap: "seamLap",
  lap: "seamLap",
  hole: "screwHoleDiameter",
  holed: "screwHoleDiameter",
  hpx: "holePitchX",
  hpy: "holePitchY",
} as const

export function parseSplitCaseModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "splitcase" || tokens[0]?.toLowerCase() !== "splitcase") {
    throw new Error("Expected splitcase without an inline value")
  }
  const props: Record<string, unknown> = { fn: "splitcase" }
  for (const token of tokens.slice(1)) {
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (
        Object.hasOwn(props, "holePitchX") ||
        Object.hasOwn(props, "holePitchY")
      ) {
        throw new Error("Duplicate hole pitch in splitcase string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for splitcase`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "screwonlid" || lower === "screwon") {
      property = "screwOnLid"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "screws") {
        if (tokenArg !== "4") {
          throw new Error(`Expected screws4 for splitcase, got "${token}"`)
        }
        property = "screws"
        parsed = 4
      } else {
        throw new Error(`Unknown splitcase token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate splitcase property "${property}"`)
    }
    props[property] = parsed
  }
  return splitCaseModelDefinitionSchema.parse(props)
}
