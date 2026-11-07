import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { annularBlankModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  t: "thickness",
  thickness: "thickness",
  rimr: "rimRadius",
  rimradius: "rimRadius",
} as const

export function parseAnnularBlankModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "annularblank" || name?.toLowerCase() !== "annularblank")
    throw new Error("Expected annularblank without an inline value")
  const props: Record<string, unknown> = { fn: "annularblank" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid annularblank token "${token}"`)
    const key = match[1]!.toLowerCase()
    if (!Object.hasOwn(lengths, key))
      throw new Error(`Unknown annularblank token "${token}"`)
    const property = lengths[key as keyof typeof lengths]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate annularblank property "${property}"`)
    props[property] = match[2]!
  }
  return annularBlankModelDefinitionSchema.parse(props)
}
