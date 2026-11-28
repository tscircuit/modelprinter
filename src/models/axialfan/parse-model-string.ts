import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { axialFanModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  d: "depth",
  depth: "depth",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hpx: "holePitchX",
  hpy: "holePitchY",
  hub: "hubOuterDiameter",
  hubod: "hubOuterDiameter",
} as const

export function parseAxialFanModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "axialfan" || tokens[0]?.toLowerCase() !== "axialfan") {
    throw new Error("Expected axialfan without an inline value")
  }
  const props: Record<string, unknown> = { fn: "axialfan" }
  for (const token of tokens.slice(1)) {
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (
        Object.hasOwn(props, "holePitchX") ||
        Object.hasOwn(props, "holePitchY")
      ) {
        throw new Error("Duplicate hole pitch in axialfan string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for axialfan`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "cwfront") {
      property = "cwFront"
      parsed = true
    } else if (lower === "fronttorear") {
      property = "frontToRear"
      parsed = true
    } else if (lower === "flatpitched") {
      property = "flatPitched"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "blades") {
        if (!/^\d+$/.test(tokenArg)) {
          throw new Error(`Invalid blades count token "${token}"`)
        }
        property = "blades"
        parsed = Number(tokenArg)
      } else if (tokenName === "bladepitch") {
        const angleMatch = tokenArg.match(/^(\d+(?:\.\d*)?|\.\d+)(?:deg)?$/i)
        if (!angleMatch) {
          throw new Error(`Invalid blade pitch angle token "${token}"`)
        }
        property = "bladePitchAngle"
        parsed = Number(angleMatch[1])
      } else {
        throw new Error(`Unknown axialfan token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate axialfan property "${property}"`)
    }
    props[property] = parsed
  }
  return axialFanModelDefinitionSchema.parse(props)
}
