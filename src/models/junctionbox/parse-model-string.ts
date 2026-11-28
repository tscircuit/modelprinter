import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { junctionBoxModelDefinitionSchema } from "./schema"

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
  hpx: "holePitchX",
  hpy: "holePitchY",
} as const

export function parseJunctionBoxModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "junctionbox" || tokens[0]?.toLowerCase() !== "junctionbox") {
    throw new Error("Expected junctionbox without an inline value")
  }
  const props: Record<string, unknown> = { fn: "junctionbox" }
  for (const token of tokens.slice(1)) {
    const koTuple = token.match(
      /^knockouts\(([^,()]+),([^,()]+),([^,()]+),([^,()]+)\)$/i,
    )
    if (koTuple) {
      const [, f = "", r = "", b = "", l = ""] = koTuple
      if (Object.hasOwn(props, "frontKnockoutDiameter")) {
        throw new Error("Duplicate knockouts specification in junctionbox")
      }
      props.frontKnockoutDiameter = f.trim()
      props.rightKnockoutDiameter = r.trim()
      props.rearKnockoutDiameter = b.trim()
      props.leftKnockoutDiameter = l.trim()
      continue
    }
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (
        Object.hasOwn(props, "holePitchX") ||
        Object.hasOwn(props, "holePitchY")
      ) {
        throw new Error("Duplicate hole pitch in junctionbox string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for junctionbox`,
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
      } else if (tokenName === "knockout") {
        if (!tokenArg || Object.hasOwn(props, "frontKnockoutDiameter")) {
          throw new Error(`Invalid or duplicate knockout token "${token}"`)
        }
        props.frontKnockoutDiameter = tokenArg
        props.rightKnockoutDiameter = tokenArg
        props.rearKnockoutDiameter = tokenArg
        props.leftKnockoutDiameter = tokenArg
        continue
      } else if (tokenName === "screws") {
        if (tokenArg !== "4") {
          throw new Error(`Expected screws4 for junctionbox, got "${token}"`)
        }
        property = "lidScrews"
        parsed = 4
      } else {
        throw new Error(`Unknown junctionbox token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate junctionbox property "${property}"`)
    }
    props[property] = parsed
  }
  return junctionBoxModelDefinitionSchema.parse(props)
}
