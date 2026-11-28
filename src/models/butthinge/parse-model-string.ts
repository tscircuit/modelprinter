import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { buttHingeModelDefinitionSchema } from "./schema"

const lengths = {
  w: "openWidth",
  width: "openWidth",
  openw: "openWidth",
  l: "length",
  length: "length",
  t: "leafThickness",
  thickness: "leafThickness",
  pin: "pinDiameter",
  pind: "pinDiameter",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hpx: "holePitchX",
  hpy: "holePitchY",
} as const

export function parseButtHingeModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "butthinge" || tokens[0]?.toLowerCase() !== "butthinge") {
    throw new Error("Expected butthinge without an inline value")
  }
  const props: Record<string, unknown> = { fn: "butthinge" }
  for (const token of tokens.slice(1)) {
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (
        Object.hasOwn(props, "holePitchX") ||
        Object.hasOwn(props, "holePitchY")
      ) {
        throw new Error("Duplicate hole pitch in butthinge string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for butthinge`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "equalleaf" || lower === "equalleaves") {
      property = "equalLeaf"
      parsed = true
    } else if (lower === "open180deg" || lower === "open180") {
      property = "openAngle"
      parsed = 180
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "knuckles") {
        if (!/^\d+$/.test(tokenArg)) {
          throw new Error(`Invalid knuckles token "${token}"`)
        }
        property = "knuckles"
        parsed = Number(tokenArg)
      } else if (tokenName === "holes") {
        if (tokenArg !== "4" && tokenArg !== "6" && tokenArg !== "8") {
          throw new Error(`Expected holes4/holes6/holes8, got "${token}"`)
        }
        property = "holes"
        parsed = Number(tokenArg)
      } else {
        throw new Error(`Unknown butthinge token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate butthinge property "${property}"`)
    }
    props[property] = parsed
  }
  return buttHingeModelDefinitionSchema.parse(props)
}
