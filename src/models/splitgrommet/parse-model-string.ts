import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { splitGrommetModelDefinitionSchema } from "./schema"
const lengths: Record<string, string> = {
  panelhole: "panelHoleDiameter",
  id: "innerDiameter",
  od: "outerDiameter",
  h: "height",
  groovew: "grooveWidth",
  grooved: "grooveDepth",
  split: "splitWidth",
  panelholediameter: "panelHoleDiameter",
  innerdiameter: "innerDiameter",
  outerdiameter: "outerDiameter",
  height: "height",
  groovewidth: "grooveWidth",
  groovedepth: "grooveDepth",
  splitwidth: "splitWidth",
}
const flags: Record<string, string> = {}
const selectors: Record<string, { value: string; property: string }> = {}
const integers: Record<string, string> = {}
const tuples: Record<string, readonly [string, string]> = {}
export function parseSplitGrommetModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "splitgrommet" || name?.toLowerCase() !== "splitgrommet")
    throw new Error("Expected splitgrommet without inline values")
  const props: Record<string, unknown> = { fn: "splitgrommet" }
  const assign = (property: string, value: unknown) => {
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate splitgrommet property "${property}"`)
    props[property] = value
  }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Malformed splitgrommet token "${token}"`)
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
    } else throw new Error(`Unknown or malformed splitgrommet token "${token}"`)
  }
  return splitGrommetModelDefinitionSchema.parse(props)
}
