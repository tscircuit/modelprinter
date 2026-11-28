import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { diaphragmPumpModelDefinitionSchema } from "./schema"

const lengths = {
  portod: "portOuterDiameter",
  l: "length",
  w: "width",
  h: "height",
  holep: "holePitch",
  holed: "holeDiameter",
} as const

export function parseDiaphragmPumpModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "diaphragmpump" ||
    tokens[0]?.toLowerCase() !== "diaphragmpump"
  ) {
    throw new Error("Expected diaphragmpump without an inline value")
  }
  const props: Record<string, unknown> = { fn: "diaphragmpump" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for diaphragmpump`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "twindiaphragm") {
      if (Object.hasOwn(props, "twinDiaphragm")) {
        throw new Error("Duplicate diaphragmpump twindiaphragm flag")
      }
      props.twinDiaphragm = true
      continue
    }
    if (lower === "airdrive") {
      if (Object.hasOwn(props, "airDrive")) {
        throw new Error("Duplicate diaphragmpump airdrive flag")
      }
      props.airDrive = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate diaphragmpump holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate diaphragmpump property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown diaphragmpump token "${token}"`)
    }
  }
  return diaphragmPumpModelDefinitionSchema.parse(props)
}
