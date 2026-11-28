import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { couplingNutModelDefinitionSchema } from "./schema"

const lengthAliases = {
  l: "length",
  length: "length",
  af: "acrossFlats",
  acrossflats: "acrossFlats",
  threadpitch: "threadPitch",
} as const

export function parseCouplingNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "couplingnut" || tokens[0]?.toLowerCase() !== "couplingnut") {
    throw new Error("Expected couplingnut without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "couplingnut" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "din6334") {
      property = "din6334"
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
    } else if (/^threadclass\([^()]+\)$/i.test(token)) {
      property = "threadClass"
      parsed = token.slice(token.indexOf("(") + 1, -1).toUpperCase()
    } else {
      const tokenMatch = token.match(/^([a-z]+)(.+)$/i)
      const key = tokenMatch?.[1]?.toLowerCase()
      const arg = tokenMatch?.[2]
      if (!key || !arg || !Object.hasOwn(lengthAliases, key)) {
        throw new Error(`Unknown or malformed couplingnut token "${token}"`)
      }
      property = lengthAliases[key as keyof typeof lengthAliases]
      parsed = arg
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate couplingnut property "${property}"`)
    }
    props[property] = parsed
  }
  return couplingNutModelDefinitionSchema.parse(props)
}
