import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { wingNutModelDefinitionSchema } from "./schema"

export function parseWingNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "wingnut" || tokens[0]?.toLowerCase() !== "wingnut") {
    throw new Error("Expected wingnut without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "wingnut" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "din315") {
      property = "din315"
      parsed = true
    } else if (lower === "roundedwings") {
      property = "roundedWings"
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
      throw new Error(`Unknown or malformed wingnut token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate wingnut property "${property}"`)
    }
    props[property] = parsed
  }
  return wingNutModelDefinitionSchema.parse(props)
}
