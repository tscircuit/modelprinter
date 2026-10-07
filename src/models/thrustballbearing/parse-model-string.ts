import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { thrustBallBearingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  h: "height",
  height: "height",
} as const

export function parseThrustBallBearingModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "thrustballbearing" ||
    tokens[0]?.toLowerCase() !== "thrustballbearing"
  )
    throw new Error("Expected thrustballbearing without an inline value")
  const props: Record<string, unknown> = { fn: "thrustballbearing" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)([\d.+-].*)?$/i)
    const name = match?.[1]?.toLowerCase()
    if (!name || !Object.hasOwn(lengths, name))
      throw new Error(`Unknown thrust ball bearing token "${token}"`)
    const property = lengths[name as keyof typeof lengths]
    if (!match?.[2])
      throw new Error(`Thrust bearing token "${token}" needs a length`)
    if (Object.hasOwn(props, property))
      throw new Error(
        `Thrust bearing property "${property}" is set more than once`,
      )
    props[property] = match[2]
  }
  return thrustBallBearingModelDefinitionSchema.parse(props)
}
