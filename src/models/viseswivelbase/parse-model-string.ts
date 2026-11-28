import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { viseSwivelBaseModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  h: "height",
  baset: "baseThickness",
  topod: "topOuterDiameter",
  topt: "topThickness",
  pilot: "pilotDiameter",
  piloth: "pilotHeight",
  arcpcd: "arcPcd",
  arcw: "arcWidth",
  tophole: "topHoleDiameter",
  pitchx: "pitchX",
  pitchy: "pitchY",
} as const

export function parseViseSwivelBaseModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "viseswivelbase" ||
    tokens[0]?.toLowerCase() !== "viseswivelbase"
  ) {
    throw new Error("Expected viseswivelbase without an inline value")
  }
  const props: Record<string, unknown> = { fn: "viseswivelbase" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for viseswivelbase`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "arcs") {
      if (!tokenArg) throw new Error(`Missing arc count in "${token}"`)
      if (Object.hasOwn(props, "arcs")) {
        throw new Error("Duplicate viseswivelbase arcs")
      }
      props.arcs = parseGearInteger(tokenArg, "arcs")
    } else if (tokenName === "topholes") {
      if (!tokenArg) throw new Error(`Missing tophole count in "${token}"`)
      if (Object.hasOwn(props, "topHoles")) {
        throw new Error("Duplicate viseswivelbase topholes")
      }
      props.topHoles = parseGearInteger(tokenArg, "topholes")
    } else if (tokenName === "arcangle") {
      if (!tokenArg) throw new Error(`Missing arc angle in "${token}"`)
      if (Object.hasOwn(props, "arcAngle")) {
        throw new Error("Duplicate viseswivelbase arcangle")
      }
      props.arcAngle = parseGearAngle(tokenArg, "arcangle")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate viseswivelbase property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown viseswivelbase token "${token}"`)
    }
  }
  return viseSwivelBaseModelDefinitionSchema.parse(props)
}
