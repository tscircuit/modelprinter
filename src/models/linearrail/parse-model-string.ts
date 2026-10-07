import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { linearRailModelDefinitionSchema } from "./schema"
const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  l: "length",
  length: "length",
  baseh: "baseHeight",
  baseheight: "baseHeight",
  neckw: "neckWidth",
  neckwidth: "neckWidth",
  neckh: "neckHeight",
  neckheight: "neckHeight",
  chamfer: "chamfer",
  hole: "holeDiameter",
  holediameter: "holeDiameter",
  pitch: "holePitch",
  holepitch: "holePitch",
  offset: "firstHoleOffset",
  firstholeoffset: "firstHoleOffset",
  cbore: "counterboreDiameter",
  counterborediameter: "counterboreDiameter",
  cbored: "counterboreDepth",
  counterboredepth: "counterboreDepth",
} as const
export function parseLinearRailModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "linearrail" || tokens[0]?.toLowerCase() !== raw.fn)
    throw new Error("Expected linearrail without an inline value")
  const props: Record<string, unknown> = { fn: "linearrail" }
  for (const token of tokens.slice(1)) {
    const [name, value] = parseGearToken(token)
    let property: string
    let parsed: unknown = value
    if (name in lengths) property = lengths[name as keyof typeof lengths]
    else if (name === "holes" || name === "holecount") {
      property = "holeCount"
      parsed = parseGearInteger(value, "Hole count")
    } else throw new Error(`Unknown linearrail token "${token}"`)
    if (property in props)
      throw new Error(`Repeated linearrail property "${property}"`)
    props[property] = parsed
  }
  return linearRailModelDefinitionSchema.parse(props)
}
