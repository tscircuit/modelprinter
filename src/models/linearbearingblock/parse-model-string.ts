import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { linearBearingBlockModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  id: "boreDiameter",
  borediameter: "boreDiameter",
  bearingod: "bearingOuterDiameter",
  bearingouterdiameter: "bearingOuterDiameter",
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  h: "height",
  height: "height",
  hole: "mountHoleDiameter",
  holediameter: "mountHoleDiameter",
  pitchx: "mountPitchX",
  pitchy: "mountPitchY",
} as const
const enums = {
  mount: "mount",
} as const

export function parseLinearBearingBlockModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "linearbearingblock" ||
    tokens[0]?.toLowerCase() !== "linearbearingblock"
  )
    throw new Error("Expected linearbearingblock without an inline value")
  const props: Record<string, unknown> = { fn: "linearbearingblock" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid linearbearingblock token "${token}"`)
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
    } else throw new Error(`Unknown linearbearingblock token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(
        `linearbearingblock property "${property}" is set more than once`,
      )
    props[property] = parsed
  }
  return linearBearingBlockModelDefinitionSchema.parse(props)
}
