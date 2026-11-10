import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ductFlangeModelDefinitionSchema } from "./schema"

const aliases = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  t: "thickness",
  thickness: "thickness",
  holes: "holeCount",
  holecount: "holeCount",
  hole: "holeDiameter",
  holediameter: "holeDiameter",
  pcd: "pitchCircleDiameter",
  pitchcirclediameter: "pitchCircleDiameter",
  clock: "clockAngle",
  clockangle: "clockAngle",
} as const

export function parseDuctFlangeModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "ductflange" || name?.toLowerCase() !== "ductflange")
    throw new Error("Expected ductflange without an inline value")

  const props: Record<string, unknown> = { fn: "ductflange" }
  for (const token of tokens) {
    const [key, value] = parseGearToken(token)
    if (!value || !Object.hasOwn(aliases, key))
      throw new Error(`Unknown or malformed ductflange token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Repeated ductflange property "${property}"`)
    props[property] =
      property === "holeCount"
        ? parseGearInteger(value, property)
        : property === "clockAngle"
          ? parseGearAngle(value, property)
          : value
  }
  return ductFlangeModelDefinitionSchema.parse(props)
}
