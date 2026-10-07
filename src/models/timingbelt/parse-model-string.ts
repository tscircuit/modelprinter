import { timingBeltModelDefinitionSchema } from "./schema"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
const lengths: Record<string, string> = { w: "width", width: "width" }
const counts: Record<string, string> = {
  teeth: "toothCount",
  toothcount: "toothCount",
}
const selectors: Record<string, string> = { profile: "profile", shape: "shape" }
export function parseTimingBeltModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "timingbelt" || !/^timingbelt$/i.test(tokens[0]!))
    throw new Error("Expected timingbelt without an inline value")
  const props: Record<string, unknown> = { fn: "timingbelt" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase(),
      value = match?.[2]
    if (!name || !value) throw new Error(`Invalid timingbelt token "${token}"`)
    let property: string,
      parsed: unknown = value
    if (Object.hasOwn(lengths, name)) property = lengths[name]!
    else if (Object.hasOwn(counts, name)) {
      property = counts[name]!
      if (!/^\d+$/.test(value))
        throw new Error("Tooth count must be a complete integer")
      parsed = Number(value)
    } else if (Object.hasOwn(selectors, name)) {
      property = selectors[name]!
      const selection = value.match(/^\(([a-z][a-z0-9]*)\)$/i)
      if (!selection) throw new Error("Selectors require parentheses")
      parsed = selection[1]!.toLowerCase()
    } else throw new Error(`Unknown timingbelt token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate timingbelt property "${property}"`)
    props[property] = parsed
  }
  return timingBeltModelDefinitionSchema.parse(props)
}
