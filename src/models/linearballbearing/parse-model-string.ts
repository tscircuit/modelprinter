import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { linearBallBearingModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  id: "boreDiameter",
  borediameter: "boreDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  l: "length",
  length: "length",
} as const
const enums = {
  seals: "seals",
} as const

export function parseLinearBallBearingModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "linearballbearing" ||
    tokens[0]?.toLowerCase() !== "linearballbearing"
  )
    throw new Error("Expected linearballbearing without an inline value")
  const props: Record<string, unknown> = { fn: "linearballbearing" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid linearballbearing token "${token}"`)
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown
    if (Object.hasOwn(lengths, name)) {
      property = lengths[name as keyof typeof lengths]
      parsed = value
    } else if (Object.hasOwn(enums, name)) {
      property = enums[name as keyof typeof enums]
      const option = value.match(/^\(([a-z]+)\)$/i)
      if (!option) throw new Error(`${name} requires a parenthesized value`)
      parsed = option[1]!.toLowerCase()
    } else throw new Error(`Unknown linearballbearing token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(
        `linearballbearing property "${property}" is set more than once`,
      )
    props[property] = parsed
  }
  return linearBallBearingModelDefinitionSchema.parse(props)
}
