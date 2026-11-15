import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tSlotEndCapModelDefinitionSchema } from "./schema"
const aliases: Record<string, string> = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  t: "thickness",
  thickness: "thickness",
  corner: "cornerRadius",
  cornerr: "cornerRadius",
  cornerradius: "cornerRadius",
  pinod: "pinDiameter",
  pindiameter: "pinDiameter",
  pinl: "pinLength",
  pinlength: "pinLength",
  pins: "pinCount",
}
const flags: Record<string, string> = {
  centered: "centered",
}
const literals: Record<string, readonly [string, string]> = {}
export function parseTSlotEndCapModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "tslotendcap" || name?.toLowerCase() !== "tslotendcap")
    throw new Error("Expected tslotendcap without inline values")
  const props: Record<string, unknown> = { fn: "tslotendcap" }
  const assign = (property: string, value: unknown) => {
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate tslotendcap property "${property}"`)
    props[property] = value
  }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || value === undefined)
      throw new Error(`Malformed tslotendcap token "${token}"`)
    if (Object.hasOwn(flags, key)) {
      if (value !== "")
        throw new Error(`tslotendcap flag "${key}" takes no value`)
      assign(flags[key]!, true)
    } else if (Object.hasOwn(literals, key)) {
      const [literal, property] = literals[key]!
      if (value.toLowerCase() !== `(${literal})`)
        throw new Error(`Expected tslotendcap ${key}(${literal})`)
      assign(property, true)
    } else if (Object.hasOwn(aliases, key) && value) {
      const property = aliases[key]!
      if (property === "pinCount" && !/^\d+$/.test(value))
        throw new Error("Pin count must be an integer token")
      assign(property, property === "pinCount" ? Number(value) : value)
    } else throw new Error(`Unknown or malformed tslotendcap token "${token}"`)
  }
  return tSlotEndCapModelDefinitionSchema.parse(props)
}
