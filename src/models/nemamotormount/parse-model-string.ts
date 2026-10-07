import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { nemaMotorMountModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  depth: "baseDepth",
  basedepth: "baseDepth",
  t: "thickness",
  thickness: "thickness",
  axisheight: "axisHeight",
  span: "mountingHoleSpacing",
  mountspan: "mountingHoleSpacing",
  mountingholespacing: "mountingHoleSpacing",
  motorhole: "mountingHoleDiameter",
  mountingholediameter: "mountingHoleDiameter",
  shaft: "shaftClearanceDiameter",
  shaftclearance: "shaftClearanceDiameter",
  shaftclearancediameter: "shaftClearanceDiameter",
  basexspan: "baseHoleSpacing",
  baseholespacing: "baseHoleSpacing",
  basehole: "baseHoleDiameter",
  baseholediameter: "baseHoleDiameter",
  baseoffset: "baseHoleOffset",
  baseholeoffset: "baseHoleOffset",
} as const

export function parseNemaMotorMountModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "nemamotormount" || tokens[0]?.toLowerCase() !== raw.fn)
    throw new Error("Expected nemamotormount without an inline value")
  const props: Record<string, unknown> = { fn: "nemamotormount" }
  for (const token of tokens.slice(1)) {
    const [name, value] = parseGearToken(token)
    let property: string
    let parsed: unknown = value
    if (name === "nema" || name === "nemasize") {
      property = "nemaSize"
      parsed = parseGearInteger(value, "nemaSize")
    } else if (name in lengths) property = lengths[name as keyof typeof lengths]
    else throw new Error(`Unknown NEMA motor mount token "${token}"`)
    if (property in props)
      throw new Error(`NEMA motor mount property "${property}" is repeated`)
    props[property] = parsed
  }
  return nemaMotorMountModelDefinitionSchema.parse(props)
}
