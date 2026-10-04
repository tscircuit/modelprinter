import {
  ballBearingModelDefinitionSchema,
  thrustBallBearingModelDefinitionSchema,
} from "./ball-bearing-schema"
import type { RawModelprinterParams } from "./parse-model-string"

const parseBearingProps = (
  raw: RawModelprinterParams,
  fn: "ballbearing" | "thrustballbearing",
) => {
  if (raw.fn !== fn) {
    throw new Error(`Expected ${fn} params, got "${raw.fn}"`)
  }
  const tokens = raw.string.split("_")
  if (tokens[0]?.toLowerCase() !== fn) {
    throw new Error(`The ${fn} function does not accept an inline value`)
  }
  const properties: Record<string, string> = {
    id: "innerDiameter",
    innerdiameter: "innerDiameter",
    od: "outerDiameter",
    outerdiameter: "outerDiameter",
    ...(fn === "ballbearing"
      ? { w: "width", width: "width" }
      : { h: "height", height: "height" }),
  }
  const props: Record<string, string> = {}
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)([\d.+-].*)?$/i)
    const property =
      match && Object.hasOwn(properties, match[1]!.toLowerCase())
        ? properties[match[1]!.toLowerCase()]
        : undefined
    if (!property) throw new Error(`Unknown ${fn} token "${token}"`)
    if (!match?.[2]) throw new Error(`Bearing token "${token}" needs a length`)
    if (Object.hasOwn(props, property)) {
      throw new Error(`Bearing property "${property}" is set more than once`)
    }
    props[property] = match[2]
  }
  return props
}

export const parseBallBearingModelParams = (raw: RawModelprinterParams) =>
  ballBearingModelDefinitionSchema.parse({
    fn: "ballbearing",
    ...parseBearingProps(raw, "ballbearing"),
  })

export const parseThrustBallBearingModelParams = (raw: RawModelprinterParams) =>
  thrustBallBearingModelDefinitionSchema.parse({
    fn: "thrustballbearing",
    ...parseBearingProps(raw, "thrustballbearing"),
  })
