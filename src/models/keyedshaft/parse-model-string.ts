import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { keyedShaftModelDefinitionSchema } from "./schema"
const aliases: Record<string, string> = {
  d: "diameter",
  diameter: "diameter",
  l: "length",
  length: "length",
  keyw: "keyWidth",
  keywidth: "keyWidth",
  keydepth: "keyDepth",
  keyl: "keyLength",
  keylength: "keyLength",
  endchamfer: "endChamfer",
}
const flags: Record<string, string> = {}
const literals: Record<string, readonly [string, string]> = {}
export function parseKeyedShaftModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "keyedshaft" || name?.toLowerCase() !== "keyedshaft")
    throw new Error("Expected keyedshaft without inline values")
  const props: Record<string, unknown> = { fn: "keyedshaft" }
  const assign = (property: string, value: unknown) => {
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate keyedshaft property "${property}"`)
    props[property] = value
  }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || value === undefined)
      throw new Error(`Malformed keyedshaft token "${token}"`)
    if (Object.hasOwn(flags, key)) {
      if (value !== "")
        throw new Error(`keyedshaft flag "${key}" takes no value`)
      assign(flags[key]!, true)
    } else if (Object.hasOwn(literals, key)) {
      const [literal, property] = literals[key]!
      if (value.toLowerCase() !== `(${literal})`)
        throw new Error(`Expected keyedshaft ${key}(${literal})`)
      assign(property, true)
    } else if (Object.hasOwn(aliases, key) && value) {
      const property = aliases[key]!
      assign(property, property === "pinCount" ? Number(value) : value)
    } else throw new Error(`Unknown or malformed keyedshaft token "${token}"`)
  }
  return keyedShaftModelDefinitionSchema.parse(props)
}
