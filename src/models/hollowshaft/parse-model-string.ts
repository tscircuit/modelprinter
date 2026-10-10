import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { hollowShaftModelDefinitionSchema } from "./schema"
const aliases: Record<string, string> = {
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  l: "length",
  length: "length",
  endchamfer: "endChamfer",
}
const flags: Record<string, string> = {
  roundtube: "roundTube",
}
const literals: Record<string, readonly [string, string]> = {
  style: ["roundtube", "roundTube"],
}
export function parseHollowShaftModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "hollowshaft" || name?.toLowerCase() !== "hollowshaft")
    throw new Error("Expected hollowshaft without inline values")
  const props: Record<string, unknown> = { fn: "hollowshaft" }
  const assign = (property: string, value: unknown) => {
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate hollowshaft property "${property}"`)
    props[property] = value
  }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || value === undefined)
      throw new Error(`Malformed hollowshaft token "${token}"`)
    if (Object.hasOwn(flags, key)) {
      if (value !== "")
        throw new Error(`hollowshaft flag "${key}" takes no value`)
      assign(flags[key]!, true)
    } else if (Object.hasOwn(literals, key)) {
      const [literal, property] = literals[key]!
      if (value.toLowerCase() !== `(${literal})`)
        throw new Error(`Expected hollowshaft ${key}(${literal})`)
      assign(property, true)
    } else if (Object.hasOwn(aliases, key) && value) {
      const property = aliases[key]!
      assign(property, property === "pinCount" ? Number(value) : value)
    } else throw new Error(`Unknown or malformed hollowshaft token "${token}"`)
  }
  return hollowShaftModelDefinitionSchema.parse(props)
}
