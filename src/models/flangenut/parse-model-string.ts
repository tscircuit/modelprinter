import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { flangeNutModelDefinitionSchema } from "./schema"

export function parseFlangeNutModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "flangenut" || tokens[0]?.toLowerCase() !== "flangenut")
    throw new Error("Expected flangenut without an inline argument")
  const props: Record<string, unknown> = { fn: "flangenut" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid flange nut token "${token}"`)
    const name = match[1]!.toLowerCase(),
      value = match[2]!
    let property: string, parsed: unknown
    if (name === "m") {
      if (!/^\d+$/.test(value))
        throw new Error("m requires a unitless metric designation")
      property = "metricSize"
      parsed = `M${value}`
    } else if (name === "standard") {
      if (!/^\([^()]+\)$/.test(value))
        throw new Error("standard requires one parenthesized argument")
      property = "standard"
      parsed = value.slice(1, -1).toLowerCase()
    } else if (name === "threadpitch") {
      property = "threadPitch"
      parsed = value
    } else if (
      name === "plainface" ||
      name === "righthanded" ||
      name === "threads" ||
      name === "nothreads"
    ) {
      if (value) throw new Error("Flange nut flags cannot have a value")
      property =
        name === "plainface"
          ? "plainFace"
          : name === "righthanded"
            ? "rightHanded"
            : "showThreads"
      parsed =
        name === "plainface"
          ? true
          : name === "righthanded"
            ? true
            : name === "threads"
    } else throw new Error(`Unknown flange nut token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate flange nut property "${property}"`)
    props[property] = parsed
  }
  return flangeNutModelDefinitionSchema.parse(props)
}
