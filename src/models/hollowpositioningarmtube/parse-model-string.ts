import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { hollowPositioningArmTubeModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  id: "innerDiameter",
  start: "startLength",
  end: "endLength",
  radius: "bendRadius",
  pitch: "ribPitch",
  depth: "ribDepth",
} as const

export function parseHollowPositioningArmTubeModelParams(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "hollowpositioningarmtube" ||
    !/^hollowpositioningarmtube$/i.test(tokens[0]!)
  )
    throw new Error("Expected hollowpositioningarmtube without an inline value")
  const props: Record<string, unknown> = { fn: "hollowpositioningarmtube" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!name || !value)
      throw new Error(`Invalid hollowpositioningarmtube token "${token}"`)
    let property: string
    let parsed: unknown = value
    if (name in lengths) property = lengths[name as keyof typeof lengths]
    else if (name === "angle") {
      property = "bendAngle"
      if (!/^[+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value))
        throw new Error(
          "Hollow positioning arm tube angle requires a unitless degree value",
        )
      parsed = Number(value)
    } else throw new Error(`Unknown hollowpositioningarmtube token "${token}"`)
    if (property in props)
      throw new Error(
        `Duplicate hollowpositioningarmtube property "${property}"`,
      )
    props[property] = parsed
  }
  return hollowPositioningArmTubeModelDefinitionSchema.parse(props)
}
