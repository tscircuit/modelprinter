import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { anglePlateModelDefinitionSchema } from "./schema"

const aliases = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  d: "depth",
  depth: "depth",
  t: "thickness",
  thickness: "thickness",
  innerr: "innerRadius",
  innerradius: "innerRadius",
  baseholes: "baseHoleCount",
  baseholecount: "baseHoleCount",
  hole: "holeDiameter",
  holediameter: "holeDiameter",
  pitchx: "basePitchX",
  basepitchx: "basePitchX",
  pitchy: "basePitchY",
  basepitchy: "basePitchY",
  faceholes: "faceHoleCount",
  faceholecount: "faceHoleCount",
  facepitch: "facePitch",
  facez: "faceHeight",
  faceheight: "faceHeight",
} as const

export function parseAnglePlateModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "angleplate" || name?.toLowerCase() !== "angleplate") {
    throw new Error("Expected angleplate without inline values")
  }
  const props: Record<string, unknown> = { fn: "angleplate" }
  for (const token of tokens) {
    const [key, value] = parseGearToken(token)
    if (!Object.hasOwn(aliases, key) || !value) {
      throw new Error(`Unknown or malformed angleplate token "${token}"`)
    }
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property)) {
      throw new Error(`Repeated angleplate property "${property}"`)
    }
    props[property] =
      property === "baseHoleCount" || property === "faceHoleCount"
        ? parseGearInteger(value, property)
        : value
  }
  return anglePlateModelDefinitionSchema.parse(props)
}
