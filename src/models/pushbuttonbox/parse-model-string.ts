import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pushbuttonBoxModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  wall: "wallThickness",
  corner: "cornerRadius",
  lidt: "lidThickness",
  hole: "cutoutDiameter",
  cutout: "cutoutDiameter",
  hpx: "holePitchX",
  hpy: "holePitchY",
} as const

export function parsePushbuttonBoxModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "pushbuttonbox" ||
    tokens[0]?.toLowerCase() !== "pushbuttonbox"
  ) {
    throw new Error("Expected pushbuttonbox without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pushbuttonbox" }
  for (const token of tokens.slice(1)) {
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (
        Object.hasOwn(props, "holePitchX") ||
        Object.hasOwn(props, "holePitchY")
      ) {
        throw new Error("Duplicate hp(...) in pushbuttonbox string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pushbuttonbox`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "screwonlid") {
      property = "screwOnLid"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "screws") {
        property = "screws"
        parsed = parseGearInteger(tokenArg, "screws")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown pushbuttonbox token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate pushbuttonbox property "${property}"`)
    }
    props[property] = parsed
  }
  return pushbuttonBoxModelDefinitionSchema.parse(props)
}
