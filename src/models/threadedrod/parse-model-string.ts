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
export function parseThreadedRodModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "threadedrod" || tokens[0]?.toLowerCase() !== "threadedrod")
    throw new Error("Expected threadedrod without an inline value")
  const props: Record<string, unknown> = { fn: "threadedrod" }
  const seen = new Set<string>()
  for (const token of tokens.slice(1)) {
    const flag = token.toLowerCase()
    if (flag === "lefthanded" || flag === "righthanded") {
      if (seen.has("leftHand"))
        throw new Error("Duplicate or conflicting threaded rod handedness")
      seen.add("leftHand")
      props.leftHand = flag === "lefthanded"
      continue
    }
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
    } else throw new Error(`Unknown threaded rod token "${token}"`)
    if (seen.has(property))
      throw new Error(
        `Threaded rod property "${property}" is set more than once`,
      )
    seen.add(property)
    props[property] = parsed
  }
  return threadedRodModelDefinitionSchema.parse(props)
}

/** Validate flags before omitting explicit default handedness. */
export function normalizeThreadedRodModelString(value: string) {
  // Renderers inspect bare names through .params() before parsing dimensions.
  if (value.toLowerCase() === "threadedrod") return "threadedrod"
  parseThreadedRodModelParams(parseModelStringParams(value))
  return splitModelStringTokens(value)
    .flatMap((token, index) => {
      if (index === 0) return [token.toLowerCase()]
      const lower = token.toLowerCase()
      if (lower === "righthanded") return []
      return [lower === "lefthanded" ? lower : token]
    })
    .join("_")
}
