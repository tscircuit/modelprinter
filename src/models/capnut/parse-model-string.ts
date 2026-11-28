import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { capNutModelDefinitionSchema } from "./schema"

export function parseCapNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "capnut" || tokens[0]?.toLowerCase() !== "capnut") {
    throw new Error("Expected capnut without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "capnut" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "din1587") {
      property = "din1587"
      parsed = true
    } else if (lower === "righthanded") {
      property = "rightHanded"
      parsed = true
    } else if (lower === "threads" || lower === "nothreads") {
      property = "showThreads"
      parsed = lower === "threads"
    } else if (/^m\d+(?:\.\d+)?$/i.test(token)) {
      property = "metricSize"
      parsed = `M${token.slice(1)}`
    } else if (/^threadpitch(.+)$/i.test(token)) {
      property = "threadPitch"
      parsed = token.slice("threadpitch".length)
    } else if (/^threadclass\([^()]+\)$/i.test(token)) {
      property = "threadClass"
      parsed = token.slice(token.indexOf("(") + 1, -1).toUpperCase()
    } else {
      throw new Error(`Unknown or malformed capnut token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate capnut property "${property}"`)
    }
    props[property] = parsed
  }
  return capNutModelDefinitionSchema.parse(props)
}
