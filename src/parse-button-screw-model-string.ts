import { buttonScrewModelDefinitionSchema } from "./button-screw-schema"
import type { RawModelprinterParams } from "./parse-model-string"
import { splitModelStringTokens } from "./split-model-string-tokens"

export function parseButtonScrewModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "buttonscrew" || tokens[0]?.toLowerCase() !== "buttonscrew")
    throw new Error("Expected buttonscrew without an inline argument")
  const props: Record<string, unknown> = { fn: "buttonscrew" }
  const lengths = {
    l: "length",
    length: "length",
    threadpitch: "threadPitch",
  } as const
  const selectors = {
    standard: "standard",
    drive: "drive",
    thread: "thread",
    threadhand: "threadHand",
    threadclass: "threadClass",
  } as const
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid button screw token "${token}"`)
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown = value
    if (name === "m") {
      property = "metricSize"
      parsed = `M${value}`
    } else if (name in lengths) property = lengths[name as keyof typeof lengths]
    else if (name in selectors) {
      property = selectors[name as keyof typeof selectors]
      if (!/^\([^()]+\)$/.test(value))
        throw new Error(`Expected a parenthesized ${name}`)
      parsed = value.slice(1, -1).toLowerCase()
    } else if (name === "threads" || name === "nothreads") {
      if (value) throw new Error("Thread visibility flags cannot have a value")
      property = "showThreads"
      parsed = name === "threads"
    } else throw new Error(`Unknown button screw token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate button screw property "${property}"`)
    props[property] = parsed
  }
  return buttonScrewModelDefinitionSchema.parse(props)
}
