import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { flatGasketModelDefinitionSchema } from "./schema"
const lengths: Record<string, string> = {
  id: "innerDiameter",
  od: "outerDiameter",
  t: "thickness",
  innerdiameter: "innerDiameter",
  outerdiameter: "outerDiameter",
  thickness: "thickness",
}
const flags: Record<string, string> = { flatannulus: "flatAnnulus" }
const selectors: Record<string, { value: string; property: string }> = {
  profile: { value: "flatannulus", property: "flatAnnulus" },
}
const integers: Record<string, string> = {}
const tuples: Record<string, readonly [string, string]> = {}
export function parseFlatGasketModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "flatgasket" || name?.toLowerCase() !== "flatgasket")
    throw new Error("Expected flatgasket without inline values")
  const props: Record<string, unknown> = { fn: "flatgasket" }
  const assign = (property: string, value: unknown) => {
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate flatgasket property "${property}"`)
    props[property] = value
  }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Malformed flatgasket token "${token}"`)
    const key = match[1]!.toLowerCase(),
      value = match[2]!
    if (Object.hasOwn(lengths, key) && value) assign(lengths[key]!, value)
    else if (Object.hasOwn(flags, key) && !value) assign(flags[key]!, true)
    else if (
      Object.hasOwn(selectors, key) &&
      value.toLowerCase() === `(${selectors[key]!.value})`
    )
      assign(selectors[key]!.property, true)
    else if (Object.hasOwn(integers, key) && /^\d+$/.test(value))
      assign(integers[key]!, Number(value))
    else if (Object.hasOwn(tuples, key)) {
      const pair = value.match(/^\(([^(),]+),([^(),]+)\)$/)
      if (!pair)
        throw new Error(`Token "${key}" requires two parenthesized lengths`)
      assign(tuples[key]![0], pair[1]!.trim())
      assign(tuples[key]![1], pair[2]!.trim())
    } else throw new Error(`Unknown or malformed flatgasket token "${token}"`)
  }
  return flatGasketModelDefinitionSchema.parse(props)
}
