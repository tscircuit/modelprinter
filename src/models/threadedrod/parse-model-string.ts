import { expandModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import {
  parseModelStringParams,
  type RawModelprinterParams,
} from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { threadedRodModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  chamfer: "chamfer",
  threadpitch: "threadPitch",
} as const
const fixedSelectors = {
  spec: "custom",
  thread: "full",
  ends: "flat",
} as const

function selectorValue(name: string, value: string) {
  const match = value.match(/^\(([a-z]+)\)$/i)
  if (!match) throw new Error(`Token "${name}" requires a parenthesized value`)
  return match[1]!.toLowerCase()
}

export function parseThreadedRodModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(
    expandModelStringFlags(raw.string, stringFlags),
  )
  if (raw.fn !== "threadedrod" || tokens[0]?.toLowerCase() !== "threadedrod")
    throw new Error("Expected threadedrod without an inline value")
  const props: Record<string, unknown> = { fn: "threadedrod" }
  const seen = new Set<string>()
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
    } else if (Object.hasOwn(fixedSelectors, name)) {
      property = name
      const expected = fixedSelectors[name as keyof typeof fixedSelectors]
      if (selectorValue(name, value) !== expected)
        throw new Error(`Threaded rod "${name}" only supports "${expected}"`)
    } else if (name === "threadhand") {
      property = "leftHand"
      const hand = selectorValue(name, value)
      if (hand !== "left" && hand !== "right")
        throw new Error("Threaded rod handedness must be left or right")
      parsed = hand === "left"
    } else throw new Error(`Unknown threaded rod token "${token}"`)
    if (seen.has(property))
      throw new Error(
        `Threaded rod property "${property}" is set more than once`,
      )
    seen.add(property)
    if (!Object.hasOwn(fixedSelectors, name)) props[property] = parsed
  }
  return threadedRodModelDefinitionSchema.parse(props)
}

/** Validate aliases before omitting fixed options and default handedness. */
export function normalizeThreadedRodModelString(value: string) {
  parseThreadedRodModelParams(parseModelStringParams(value))
  const preferred = new Map<string, string>(
    Object.entries(stringFlags).map(([flag, selector]) => [selector, flag]),
  )
  const omitted = new Set<string>(
    omittedStringFlags.map((flag) => stringFlags[flag]),
  )
  return splitModelStringTokens(expandModelStringFlags(value, stringFlags))
    .flatMap((token, index) => {
      if (index === 0) return [token.toLowerCase()]
      const lower = token.toLowerCase()
      if (omitted.has(lower)) return []
      return [preferred.get(lower) ?? token]
    })
    .join("_")
}
