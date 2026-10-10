import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { rectangularTubeModelDefinitionSchema } from "./schema"
const aliases = {
  w: "width",
  h: "height",
  wall: "wallThickness",
  l: "length",
  outerr: "outerRadius",
  innerr: "innerRadius",
  width: "width",
  height: "height",
  wallthickness: "wallThickness",
  length: "length",
  outerradius: "outerRadius",
  innerradius: "innerRadius",
} as const
export function parseRectangularTubeModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "rectangulartube" || name?.toLowerCase() !== "rectangulartube")
    throw new Error("Expected rectangulartube without inline values")
  const props: Record<string, unknown> = { fn: "rectangulartube" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed rectangulartube token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate rectangulartube property "${property}"`)
    props[property] = value
  }
  return rectangularTubeModelDefinitionSchema.parse(props)
}
