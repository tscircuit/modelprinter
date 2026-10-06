import { hexNutModelDefinitionSchema } from "./schema"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"

export function parseHexNutModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "hexnut" || tokens[0]?.toLowerCase() !== "hexnut")
    throw new Error("Expected hexnut without an inline argument")
  const props: Record<string, unknown> = { fn: "hexnut" }
  const selectors = {
    standard: "standard",
    threadhand: "threadHand",
    threadclass: "threadClass",
  } as const
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid hex nut token "${token}"`)
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown = value
    if (name === "m") {
      property = "metricSize"
      parsed = `M${value}`
    } else if (name === "threadpitch") property = "threadPitch"
    else if (name in selectors) {
      property = selectors[name as keyof typeof selectors]
      if (!/^\([^()]+\)$/.test(value))
        throw new Error(`Expected a parenthesized ${name}`)
      parsed = value.slice(1, -1).toLowerCase()
      if (property === "threadClass" && parsed === "6h") parsed = "6H"
    } else if (name === "threads" || name === "nothreads") {
      if (value) throw new Error("Thread visibility flags cannot have a value")
      property = "showThreads"
      parsed = name === "threads"
    } else throw new Error(`Unknown hex nut token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate hex nut property "${property}"`)
    props[property] = parsed
  }
  return hexNutModelDefinitionSchema.parse(props)
}
