import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { gasketBoxModelDefinitionSchema } from "./schema"

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
  lidt: "lidThickness",
  lidthickness: "lidThickness",
  groovew: "grooveWidth",
  groovewidth: "grooveWidth",
  grooved: "grooveDepth",
  groovedepth: "grooveDepth",
  hpx: "holePitchX",
  hpy: "holePitchY",
} as const

export function parseGasketBoxModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "gasketbox" || tokens[0]?.toLowerCase() !== "gasketbox") {
    throw new Error("Expected gasketbox without an inline value")
  }
  const props: Record<string, unknown> = { fn: "gasketbox" }
  for (const token of tokens.slice(1)) {
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (
        Object.hasOwn(props, "holePitchX") ||
        Object.hasOwn(props, "holePitchY")
      ) {
        throw new Error("Duplicate hole pitch in gasketbox string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for gasketbox`,
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
          throw new Error(`Expected screws4 for gasketbox, got "${token}"`)
        }
        property = "lidScrews"
        parsed = 4
      } else {
        throw new Error(`Unknown gasketbox token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate gasketbox property "${property}"`)
    }
    props[property] = parsed
  }
  return gasketBoxModelDefinitionSchema.parse(props)
}
