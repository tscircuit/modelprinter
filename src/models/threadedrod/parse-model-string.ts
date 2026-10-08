import { expandModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags } from "./string-flags"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { threadedRodModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  chamfer: "chamfer",
  threadpitch: "threadPitch",
} as const
const enums = {
  spec: "spec",
  thread: "thread",
  ends: "ends",
  threadhand: "threadHand",
} as const

export function parseThreadedRodModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(
    expandModelStringFlags(raw.string, stringFlags),
  )
  if (raw.fn !== "threadedrod" || tokens[0]?.toLowerCase() !== "threadedrod")
    throw new Error("Expected threadedrod without an inline value")
  const props: Record<string, unknown> = { fn: "threadedrod" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid threaded rod token "${token}"`)
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown
    if (name === "m") {
      property = "metricSize"
      if (!/^\d+(?:\.\d+)?$/.test(value))
        throw new Error("Metric size must be a unitless diameter")
      parsed = `M${value}`
    } else if (Object.hasOwn(lengths, name)) {
      property = lengths[name as keyof typeof lengths]
      parsed = value
    } else if (Object.hasOwn(enums, name)) {
      property = enums[name as keyof typeof enums]
      const enumMatch = value.match(/^\(([a-z]+)\)$/i)
      if (!enumMatch)
        throw new Error(`Token "${name}" requires a parenthesized value`)
      parsed = enumMatch[1]!.toLowerCase()
    } else throw new Error(`Unknown threaded rod token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(
        `Threaded rod property "${property}" is set more than once`,
      )
    props[property] = parsed
  }
  return threadedRodModelDefinitionSchema.parse(props)
}
