import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { finnedHeatsinkModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  base: "baseThickness",
  basethickness: "baseThickness",
  h: "height",
  height: "height",
  fint: "finThickness",
  finthickness: "finThickness",
  p: "finPitch",
  pitch: "finPitch",
  finpitch: "finPitch",
  hole: "holeDiameter",
  holed: "holeDiameter",
  holediameter: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
} as const

export function parseFinnedHeatsinkModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "finnedheatsink" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected finnedheatsink without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "finnedheatsink" }
  for (const token of tokens.slice(1)) {
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "longitudinal" || tokenName === "transverse") {
      if (tokenArg) {
        throw new Error(`Flag "${tokenName}" does not take an argument`)
      }
      if (Object.hasOwn(props, "longitudinal")) {
        throw new Error("Duplicate or conflicting finnedheatsink axis flag")
      }
      props.longitudinal = tokenName === "longitudinal"
      continue
    }
    let property: string
    let parsed: unknown = tokenArg
    if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length argument in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
    } else if (tokenName === "fins" || tokenName === "fincount") {
      property = "finCount"
      parsed = parseGearInteger(tokenArg, "finCount")
    } else if (tokenName === "holes" || tokenName === "holecount") {
      property = "holeCount"
      parsed = parseGearInteger(tokenArg, "holeCount")
    } else {
      throw new Error(`Unknown finned heatsink token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Finned heatsink property "${property}" is repeated`)
    }
    props[property] = parsed
  }
  return finnedHeatsinkModelDefinitionSchema.parse(props)
}
