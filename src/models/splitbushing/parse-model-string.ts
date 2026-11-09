import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { splitBushingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  l: "length",
  length: "length",
  gap: "gap",
  edgechamfer: "edgeChamfer",
} as const

export function parseSplitBushingModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "splitbushing" || name?.toLowerCase() !== "splitbushing")
    throw new Error("Expected splitbushing without an inline value")

  const props: Record<string, unknown> = { fn: "splitbushing" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    let property: string
    let parsed: unknown = value
    if (key === "plainsplit") {
      property = "plainSplit"
      if (value !== "") throw new Error("plainsplit is a value-free flag")
      parsed = true
    } else if (key && value && Object.hasOwn(lengths, key)) {
      property = lengths[key as keyof typeof lengths]
    } else {
      throw new Error(`Unknown or malformed splitbushing token "${token}"`)
    }
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate splitbushing property "${property}"`)
    props[property] = parsed
  }
  return splitBushingModelDefinitionSchema.parse(props)
}
