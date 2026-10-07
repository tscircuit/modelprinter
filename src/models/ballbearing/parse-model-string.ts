import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ballBearingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  w: "width",
  width: "width",
} as const
const enums = {
  closure: "closure",
} as const

export function parseBallBearingModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "ballbearing" || tokens[0]?.toLowerCase() !== "ballbearing")
    throw new Error("Expected ballbearing without an inline value")
  const props: Record<string, unknown> = { fn: "ballbearing" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid ballbearing token "${token}"`)
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
    } else if (name === "code") {
      property = "code"
      if (!/^\d+$/.test(value))
        throw new Error("Bearing code must be a complete numeric designation")
      parsed = value
    } else throw new Error(`Unknown ballbearing token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(
        `ballbearing property "${property}" is set more than once`,
      )
    props[property] = parsed
  }
  return ballBearingModelDefinitionSchema.parse(props)
}
