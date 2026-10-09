import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { dowelPinModelDefinitionSchema } from "./schema"
const lengths = {
  d: "diameter",
  diameter: "diameter",
  l: "length",
  length: "length",
  c: "endLeadLength",
  endleadlength: "endLeadLength",
} as const
export function parseDowelPinModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "dowelpin" || tokens[0]?.toLowerCase() !== "dowelpin")
    throw new Error("Expected dowelpin without an inline argument")
  const props: Record<string, unknown> = { fn: "dowelpin" }
  for (const token of tokens.slice(1)) {
    if (token.toLowerCase() === "iso8734") {
      if (Object.hasOwn(props, "iso8734"))
        throw new Error('Duplicate dowel pin property "iso8734"')
      props.iso8734 = true
      continue
    }
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid dowel pin token "${token}"`)
    const name = match[1]!.toLowerCase(),
      value = match[2]!
    let property: string,
      parsed: unknown = value
    if (Object.hasOwn(lengths, name))
      property = lengths[name as keyof typeof lengths]
    else if (name === "endleadangle") {
      property = "endLeadAngle"
      if (!/^\d+(?:\.\d+)?$/.test(value))
        throw new Error("End lead angle must be a unitless number")
      parsed = Number(value)
    } else throw new Error(`Unknown dowel pin token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate dowel pin property "${property}"`)
    props[property] = parsed
  }
  return dowelPinModelDefinitionSchema.parse(props)
}
