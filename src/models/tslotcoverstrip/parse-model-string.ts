import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tSlotCoverStripModelDefinitionSchema } from "./schema"
const aliases: Record<string, string> = {
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  t: "thickness",
  thickness: "thickness",
  stemw: "stemWidth",
  stemwidth: "stemWidth",
  stemh: "stemHeight",
  stemheight: "stemHeight",
  barbw: "barbWidth",
  barbwidth: "barbWidth",
  barbh: "barbHeight",
  barbheight: "barbHeight",
}
const flags: Record<string, string> = {
  tee: "tee",
}
const literals: Record<string, readonly [string, string]> = {
  profile: ["tee", "tee"],
}
export function parseTSlotCoverStripModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "tslotcoverstrip" || name?.toLowerCase() !== "tslotcoverstrip")
    throw new Error("Expected tslotcoverstrip without inline values")
  const props: Record<string, unknown> = { fn: "tslotcoverstrip" }
  const assign = (property: string, value: unknown) => {
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate tslotcoverstrip property "${property}"`)
    props[property] = value
  }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || value === undefined)
      throw new Error(`Malformed tslotcoverstrip token "${token}"`)
    if (Object.hasOwn(flags, key)) {
      if (value !== "")
        throw new Error(`tslotcoverstrip flag "${key}" takes no value`)
      assign(flags[key]!, true)
    } else if (Object.hasOwn(literals, key)) {
      const [literal, property] = literals[key]!
      if (value.toLowerCase() !== `(${literal})`)
        throw new Error(`Expected tslotcoverstrip ${key}(${literal})`)
      assign(property, true)
    } else if (Object.hasOwn(aliases, key) && value) {
      const property = aliases[key]!
      assign(property, property === "pinCount" ? Number(value) : value)
    } else
      throw new Error(`Unknown or malformed tslotcoverstrip token "${token}"`)
  }
  return tSlotCoverStripModelDefinitionSchema.parse(props)
}
