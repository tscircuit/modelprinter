import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { nylonLockNutModelDefinitionSchema } from "./schema"

export function parseNylonLockNutModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "nylonlocknut" || tokens[0]?.toLowerCase() !== "nylonlocknut")
    throw new Error("Expected nylonlocknut without an inline argument")
  const props: Record<string, unknown> = { fn: "nylonlocknut" }
  for (const token of tokens.slice(1)) {
    let property: string
    let parsed: unknown
    const lower = token.toLowerCase()
    if (/^m\d+(?:\.\d+)?$/i.test(token)) {
      property = "metricSize"
      parsed = `M${token.slice(1)}`
    } else if (/^threadpitch/i.test(token)) {
      property = "threadPitch"
      parsed = token.slice("threadpitch".length)
    } else if (/^(standard|threadclass)\([^()]+\)$/i.test(token)) {
      const name = token.slice(0, token.indexOf("(")).toLowerCase()
      property = name === "standard" ? "standard" : "threadClass"
      const value = token.slice(token.indexOf("(") + 1, -1)
      parsed = name === "standard" ? value.toLowerCase() : value.toUpperCase()
    } else if (lower === "righthanded") {
      property = "rightHanded"
      parsed = true
    } else if (lower === "threads" || lower === "nothreads") {
      property = "showThreads"
      parsed = lower === "threads"
    } else throw new Error(`Unknown nylonlocknut token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate nylonlocknut property "${property}"`)
    props[property] = parsed
  }
  return nylonLockNutModelDefinitionSchema.parse(props)
}
