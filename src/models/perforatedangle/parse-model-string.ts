import { parseGearToken, parseGearInteger } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { perforatedAngleModelDefinitionSchema } from "./schema"
const aliases = {
  w: "width",
  h: "height",
  t: "thickness",
  l: "length",
  innerr: "innerRadius",
  holes: "holeCount",
  hole: "holeDiameter",
  pitch: "pitch",
  end: "endOffset",
  legoffset: "legOffset",
  width: "width",
  height: "height",
  thickness: "thickness",
  length: "length",
  innerradius: "innerRadius",
  holecount: "holeCount",
  holediameter: "holeDiameter",
  endoffset: "endOffset",
} as const
export function parsePerforatedAngleModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "perforatedangle" || name?.toLowerCase() !== "perforatedangle")
    throw new Error("Expected perforatedangle without inline values")
  const props: Record<string, unknown> = { fn: "perforatedangle" }
  for (const token of tokens) {
    const [key, value] = parseGearToken(token)
    if (!Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed perforatedangle token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Repeated perforatedangle property "${property}"`)
    props[property] = ["holeCount"].includes(property)
      ? parseGearInteger(value, property)
      : value
  }
  return perforatedAngleModelDefinitionSchema.parse(props)
}
