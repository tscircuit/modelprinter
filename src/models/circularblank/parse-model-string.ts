import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { circularBlankModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  diameter: "diameter",
  t: "thickness",
  thickness: "thickness",
  rimr: "rimRadius",
  rimradius: "rimRadius",
} as const

export function parseCircularBlankModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "circularblank" ||
    tokens[0]?.toLowerCase() !== "circularblank"
  )
    throw new Error("Expected circularblank without an inline value")
  const props: Record<string, unknown> = { fn: "circularblank" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid circular blank token "${token}"`)
    const name = match[1]!.toLowerCase()
    if (!Object.hasOwn(lengths, name))
      throw new Error(`Unknown circular blank token "${token}"`)
    const property = lengths[name as keyof typeof lengths]
    if (Object.hasOwn(props, property))
      throw new Error(
        `Circular blank property "${property}" is set more than once`,
      )
    props[property] = match[2]!
  }
  return circularBlankModelDefinitionSchema.parse(props)
}
