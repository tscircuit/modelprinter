import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { squareTubeModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  wall: "wallThickness",
  wallthickness: "wallThickness",
  l: "length",
  length: "length",
  outerr: "outerRadius",
  outerradius: "outerRadius",
  innerr: "innerRadius",
  innerradius: "innerRadius",
} as const

export function parseSquareTubeModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "squaretube" || tokens[0]?.toLowerCase() !== "squaretube")
    throw new Error("Expected squaretube without an inline value")
  const props: Record<string, unknown> = { fn: "squaretube" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase()
    if (!name || !Object.hasOwn(lengths, name))
      throw new Error(`Unknown square tube token "${token}"`)
    const property = lengths[name as keyof typeof lengths]
    if (Object.hasOwn(props, property))
      throw new Error(`Square tube property "${property}" is repeated`)
    props[property] = match![2]
  }
  return squareTubeModelDefinitionSchema.parse(props)
}
