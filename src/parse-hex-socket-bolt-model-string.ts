import { hexSocketBoltModelDefinitionSchema } from "./hex-socket-bolt-schema"
import type { RawModelprinterParams } from "./parse-model-string"

export const parseHexSocketBoltModelParams = (raw: RawModelprinterParams) => {
  if (raw.fn !== "hexsocketbolt") {
    throw new Error(`Expected hexsocketbolt params, got "${raw.fn}"`)
  }
  const tokens = raw.string.split("_")
  if (tokens[0]?.toLowerCase() !== "hexsocketbolt") {
    throw new Error(
      "The hexsocketbolt function does not accept an inline value",
    )
  }
  const seen = new Set<string>()
  for (const token of tokens.slice(1)) {
    const name = token.match(/^[a-z]+/i)?.[0]?.toLowerCase()
    if (name && seen.has(name))
      throw new Error(`Duplicate bolt token "${name}"`)
    if (name) seen.add(name)
  }
  const props: Record<string, unknown> = {}
  for (const [token, value] of Object.entries(raw)) {
    if (["fn", "string", "hexsocketbolt"].includes(token)) continue
    let property: string
    let parsed: unknown = value
    if (token === "m") {
      property = "metricSize"
      parsed = `M${String(value)}`
    } else if (token === "l" || token === "length") {
      property = "length"
    } else if (token === "threads" || token === "nothreads") {
      if (value !== true)
        throw new Error(`Bolt token "${token}" does not accept a value`)
      property = "showThreads"
      parsed = token === "threads"
    } else {
      throw new Error(
        `Unknown hex socket bolt model token "${token}${String(value)}"`,
      )
    }
    if (property in props)
      throw new Error(`Bolt property "${property}" is set more than once`)
    props[property] = parsed
  }
  return hexSocketBoltModelDefinitionSchema.parse({
    fn: "hexsocketbolt",
    ...props,
  })
}
