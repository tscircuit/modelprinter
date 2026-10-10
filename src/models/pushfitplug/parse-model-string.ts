import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pushFitPlugModelDefinitionSchema } from "./schema"
const aliases = {
  tubeod: "tubeDiameter",
  l: "length",
  headod: "headDiameter",
  headt: "headThickness",
  tubediameter: "tubeDiameter",
  length: "length",
  headdiameter: "headDiameter",
  headthickness: "headThickness",
} as const
export function parsePushFitPlugModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "pushfitplug" || name?.toLowerCase() !== "pushfitplug")
    throw new Error("Expected pushfitplug without inline values")
  const props: Record<string, unknown> = { fn: "pushfitplug" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed pushfitplug token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate pushfitplug property "${property}"`)
    props[property] = value
  }
  return pushFitPlugModelDefinitionSchema.parse(props)
}
