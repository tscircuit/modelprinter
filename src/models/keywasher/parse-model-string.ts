import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { keyWasherModelDefinitionSchema } from "./schema"
const lengths: Record<string, string> = {
  id: "innerDiameter",
  od: "outerDiameter",
  h: "thickness",
  tabw: "tabWidth",
  tabl: "tabLength",
  innerdiameter: "innerDiameter",
  outerdiameter: "outerDiameter",
  thickness: "thickness",
  tabwidth: "tabWidth",
  tablength: "tabLength",
}
const flags: Record<string, string> = { inward: "inwardTab", custom: "custom" }
const selectors: Record<string, { value: string; property: string }> = {
  tab: { value: "inward", property: "inwardTab" },
  spec: { value: "custom", property: "custom" },
}
const integers: Record<string, string> = { tabs: "tabCount" }
const tuples: Record<string, readonly [string, string]> = {}
export function parseKeyWasherModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "keywasher" || name?.toLowerCase() !== "keywasher")
    throw new Error("Expected keywasher without inline values")
  const props: Record<string, unknown> = { fn: "keywasher" }
  const assign = (property: string, value: unknown) => {
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate keywasher property "${property}"`)
    props[property] = value
  }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Malformed keywasher token "${token}"`)
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
    } else throw new Error(`Unknown or malformed keywasher token "${token}"`)
  }
  return keyWasherModelDefinitionSchema.parse(props)
}
