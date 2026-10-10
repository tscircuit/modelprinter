import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { perforatedSheetModelDefinitionSchema } from "./schema"
const aliases = {
  l: "length",
  w: "width",
  t: "thickness",
  hole: "holeDiameter",
  pitchx: "pitchX",
  pitchy: "pitchY",
  edgex: "edgeX",
  edgey: "edgeY",
  stagger: "stagger",
  length: "length",
  width: "width",
  thickness: "thickness",
  holediameter: "holeDiameter",
} as const
export function parsePerforatedSheetModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "perforatedsheet" || name?.toLowerCase() !== "perforatedsheet")
    throw new Error("Expected perforatedsheet without inline values")
  const props: Record<string, unknown> = { fn: "perforatedsheet" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed perforatedsheet token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate perforatedsheet property "${property}"`)
    props[property] = value
  }
  return perforatedSheetModelDefinitionSchema.parse(props)
}
