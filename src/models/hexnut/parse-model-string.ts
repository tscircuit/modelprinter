import { expandModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags } from "./string-flags"
import { hexNutModelDefinitionSchema } from "./schema"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"

export function parseHexNutModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(
    expandModelStringFlags(raw.string, stringFlags),
  )
  if (raw.fn !== "hexnut" || tokens[0]?.toLowerCase() !== "hexnut")
    throw new Error("Expected hexnut without an inline argument")
  const props: Record<string, unknown> = { fn: "hexnut" }
  const selectors = {
    threadhand: "threadHand",
    threadclass: "threadClass",
  } as const
  let explicitFamily = false
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    if (["iso4032", "din934", "asmeb18.2.2", "asmeb1822"].includes(lower)) {
      if (explicitFamily)
        throw new Error("Select only one hex nut ISO, DIN or ASME flag")
      explicitFamily = true
      props[lower === "asmeb18.2.2" ? "asmeb1822" : lower] = true
      continue
    }
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid hex nut token "${token}"`)
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown = value
    if (name === "m") {
      property = "metricSize"
      parsed = `M${value}`
    } else if (name === "imperial" || name === "unc") {
      if (!/^\([^()]+\)$/.test(value))
        throw new Error("Expected a parenthesized imperial size")
      const designation = value.slice(1, -1)
      const parts = designation.split("-")
      if (parts.length > 2) throw new Error("Invalid UNC designation")
      property = "imperialSize"
      parsed = parts[0]
      if (parts.length === 2) {
        if (!/^\d+$/.test(parts[1]!) || Number(parts[1]) <= 0)
          throw new Error("Invalid threads per inch")
        if ("threadPitch" in props)
          throw new Error("Duplicate hex nut property threadPitch")
        props.threadPitch = 25.4 / Number(parts[1])
      }
    } else if (name === "threadpitch") property = "threadPitch"
    else if (name in selectors) {
      property = selectors[name as keyof typeof selectors]
      if (!/^\([^()]+\)$/.test(value))
        throw new Error(`Expected a parenthesized ${name}`)
      parsed = value.slice(1, -1).toLowerCase()
      if (property === "threadClass") parsed = String(parsed).toUpperCase()
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
