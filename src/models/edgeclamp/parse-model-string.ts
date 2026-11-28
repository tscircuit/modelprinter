import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseEdgeClampMetricSize } from "./normalize"
import { edgeClampModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  w: "width",
  h: "height",
  travel: "jawTravel",
  jaww: "jawWidth",
  jawh: "jawHeight",
  hole: "holeDiameter",
  pitch: "holePitch",
} as const

export function parseEdgeClampModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "edgeclamp" || tokens[0]?.toLowerCase() !== "edgeclamp") {
    throw new Error("Expected edgeclamp without an inline value")
  }
  const props: Record<string, unknown> = { fn: "edgeclamp" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for edgeclamp`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "drivem") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "driveThreadDiameter")) {
        throw new Error("Duplicate edgeclamp drivem")
      }
      props.driveThreadDiameter = parseEdgeClampMetricSize(tokenArg)
    } else if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate edgeclamp holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate edgeclamp property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown edgeclamp token "${token}"`)
    }
  }
  return edgeClampModelDefinitionSchema.parse(props)
}
