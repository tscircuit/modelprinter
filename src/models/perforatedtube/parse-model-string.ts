import {
  parseGearToken,
  parseGearAngle,
  parseGearInteger,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { perforatedTubeModelDefinitionSchema } from "./schema"

const aliases = {
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  wall: "wallThickness",
  wallthickness: "wallThickness",
  l: "length",
  length: "length",
  hole: "holeDiameter",
  holediameter: "holeDiameter",
  axialpitch: "axialPitch",
  rows: "rowCount",
  rowcount: "rowCount",
  end: "endOffset",
  endoffset: "endOffset",
  around: "holesAround",
  holesaround: "holesAround",
  stagger: "staggerAngle",
  staggerangle: "staggerAngle",
} as const

export function parsePerforatedTubeModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "perforatedtube" || name?.toLowerCase() !== "perforatedtube")
    throw new Error("Expected perforatedtube without an inline value")

  const props: Record<string, unknown> = { fn: "perforatedtube" }
  for (const token of tokens) {
    const [key, value] = parseGearToken(token)
    if (!value || !Object.hasOwn(aliases, key))
      throw new Error(`Unknown or malformed perforatedtube token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    const parsed =
      property === "rowCount" || property === "holesAround"
        ? parseGearInteger(value, property)
        : property === "staggerAngle"
          ? parseGearAngle(value, property)
          : value
    if (Object.hasOwn(props, property))
      throw new Error(`Repeated perforatedtube property "${property}"`)
    props[property] = parsed
  }
  return perforatedTubeModelDefinitionSchema.parse(props)
}
