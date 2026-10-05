import { compressionSpringModelDefinitionSchema } from "./compression-spring-schema"
import type { RawModelprinterParams } from "./parse-model-string"
import { splitModelStringTokens } from "./split-model-string-tokens"

export function parseCompressionSpringModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "compressionspring" ||
    tokens[0]?.toLowerCase() !== "compressionspring"
  )
    throw new Error("Expected compressionspring without an inline argument")
  const props: Record<string, unknown> = { fn: "compressionspring" }
  const lengths = {
    od: "outerDiameter",
    wire: "wireDiameter",
    l: "freeLength",
    length: "freeLength",
    freelength: "freeLength",
  } as const
  const selectors = {
    spec: "spec",
    ends: "ends",
    hand: "hand",
    state: "state",
  } as const
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid compression spring token "${token}"`)
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown = value
    if (name in lengths) property = lengths[name as keyof typeof lengths]
    else if (name === "turns" || name === "active") {
      property = name === "turns" ? "totalTurns" : "activeTurns"
      if (!/^\d+$/.test(value))
        throw new Error(`${name} requires a unitless integer`)
      parsed = Number(value)
    } else if (name in selectors) {
      property = selectors[name as keyof typeof selectors]
      if (!/^\([^()]+\)$/.test(value))
        throw new Error(`Expected a parenthesized ${name}`)
      parsed = value.slice(1, -1).toLowerCase()
    } else throw new Error(`Unknown compression spring token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate compression spring property "${property}"`)
    props[property] = parsed
  }
  return compressionSpringModelDefinitionSchema.parse(props)
}
