import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { dovetailMountingRailModelDefinitionSchema } from "./schema"

const lengths = {
  basew: "baseWidth",
  baset: "baseThickness",
  l: "length",
  headw: "headWidth",
  neckw: "neckWidth",
  dovetailh: "dovetailHeight",
  hole: "holeDiameter",
  pitch: "holePitch",
  end: "endMargin",
  counterbore: "counterboreDiameter",
  counterdepth: "counterboreDepth",
} as const

export function parseDovetailMountingRailModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "dovetailmountingrail" ||
    tokens[0]?.toLowerCase() !== "dovetailmountingrail"
  ) {
    throw new Error("Expected dovetailmountingrail without an inline value")
  }
  const props: Record<string, unknown> = { fn: "dovetailmountingrail" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for dovetailmountingrail`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate dovetailmountingrail holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName === "angle") {
      if (!tokenArg) throw new Error(`Missing angle in "${token}"`)
      if (Object.hasOwn(props, "dovetailAngle")) {
        throw new Error("Duplicate dovetailmountingrail angle")
      }
      props.dovetailAngle = parseGearAngle(tokenArg, "angle")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate dovetailmountingrail property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown dovetailmountingrail token "${token}"`)
    }
  }
  return dovetailMountingRailModelDefinitionSchema.parse(props)
}
