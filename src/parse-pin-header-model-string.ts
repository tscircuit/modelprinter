import { pinHeaderModelDefinitionSchema } from "./pin-header-schema"
import type { RawModelprinterParams } from "./parse-model-string"
import { splitModelStringTokens } from "./split-model-string-tokens"

const lengths: Record<string, string> = {
  p: "pitch",
  pitch: "pitch",
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  bodyh: "bodyHeight",
  bodyheight: "bodyHeight",
  above: "aboveLength",
  abovelength: "aboveLength",
  below: "belowLength",
  belowlength: "belowLength",
  pin: "pinWidth",
  pinwidth: "pinWidth",
}
const counts: Record<string, string> = {
  n: "pinCount",
  pincount: "pinCount",
  rows: "rows",
}
const selectors: Record<string, string> = {
  gender: "gender",
  mount: "mount",
  axis: "axis",
}

export function parsePinHeaderModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "pinheader" || tokens[0]?.toLowerCase() !== "pinheader")
    throw new Error("Expected pinheader without an inline value")
  const props: Record<string, unknown> = { fn: "pinheader" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid pin header token "${token}"`)
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown = value
    if (Object.hasOwn(lengths, name)) {
      property = lengths[name]!
      if (!/^[+\-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|mil)?$/i.test(value))
        throw new Error(`Invalid pin header length "${token}"`)
    } else if (Object.hasOwn(counts, name)) {
      property = counts[name]!
      if (!/^\d+$/.test(value))
        throw new Error(`Pin header count must be an integer: "${token}"`)
      parsed = Number(value)
    } else if (Object.hasOwn(selectors, name)) {
      property = selectors[name]!
      const selection = value.match(/^\(([a-z]+)\)$/i)
      if (!selection)
        throw new Error(
          `Pin header selector requires one parenthesized value: "${token}"`,
        )
      parsed = selection[1]!.toLowerCase()
    } else throw new Error(`Unknown pin header token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate pin header property "${property}"`)
    props[property] = parsed
  }
  return pinHeaderModelDefinitionSchema.parse(props)
}
