import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { hexShaftModelDefinitionSchema } from "./schema"
const aliases: Record<string, string> = {
  af: "acrossFlats",
  acrossflats: "acrossFlats",
  l: "length",
  length: "length",
  endchamfer: "endChamfer",
}
const flags: Record<string, string> = {
  regularhex: "regularHex",
}
const literals: Record<string, readonly [string, string]> = {
  profile: ["regularhex", "regularHex"],
}
export function parseHexShaftModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "hexshaft" || name?.toLowerCase() !== "hexshaft")
    throw new Error("Expected hexshaft without inline values")
  const props: Record<string, unknown> = { fn: "hexshaft" }
  const assign = (property: string, value: unknown) => {
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate hexshaft property "${property}"`)
    props[property] = value
  }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || value === undefined)
      throw new Error(`Malformed hexshaft token "${token}"`)
    if (Object.hasOwn(flags, key)) {
      if (value !== "") throw new Error(`hexshaft flag "${key}" takes no value`)
      assign(flags[key]!, true)
    } else if (Object.hasOwn(literals, key)) {
      const [literal, property] = literals[key]!
      if (value.toLowerCase() !== `(${literal})`)
        throw new Error(`Expected hexshaft ${key}(${literal})`)
      assign(property, true)
    } else if (Object.hasOwn(aliases, key) && value) {
      const property = aliases[key]!
      assign(property, property === "pinCount" ? Number(value) : value)
    } else throw new Error(`Unknown or malformed hexshaft token "${token}"`)
  }
  return hexShaftModelDefinitionSchema.parse(props)
}
