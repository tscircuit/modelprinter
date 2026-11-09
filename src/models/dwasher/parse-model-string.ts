import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { dWasherModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  h: "thickness",
  t: "thickness",
  thickness: "thickness",
  flatdepth: "flatDepth",
} as const

export function parseDWasherModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "dwasher" || name?.toLowerCase() !== "dwasher")
    throw new Error("Expected dwasher without an inline value")

  const props: Record<string, unknown> = { fn: "dwasher" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || !value || !Object.hasOwn(lengths, key))
      throw new Error(`Unknown or malformed dwasher token "${token}"`)
    const property = lengths[key as keyof typeof lengths]
    const parsed = value
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate dwasher property "${property}"`)
    props[property] = parsed
  }
  return dWasherModelDefinitionSchema.parse(props)
}
