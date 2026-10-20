import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pottingBoxModelDefinitionSchema } from "./schema"
const aliases = {
  w: "width",
  d: "depth",
  h: "height",
  wall: "wallThickness",
  floor: "floorThickness",
  earl: "earLength",
  earw: "earWidth",
  hole: "holeDiameter",
  hp: "holePitch",
  width: "width",
  depth: "depth",
  height: "height",
  wallthickness: "wallThickness",
  floorthickness: "floorThickness",
  earlength: "earLength",
  earwidth: "earWidth",
  holediameter: "holeDiameter",
  holepitch: "holePitch",
} as const
export function parsePottingBoxModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "pottingbox" || name?.toLowerCase() !== "pottingbox")
    throw new Error("Expected pottingbox without inline values")
  const props: Record<string, unknown> = { fn: "pottingbox" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase(),
      value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed pottingbox token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate pottingbox property "${property}"`)
    props[property] = value
  }
  return pottingBoxModelDefinitionSchema.parse(props)
}
