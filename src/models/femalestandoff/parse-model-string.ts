import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { femaleStandoffModelDefinitionSchema } from "./schema"

const lengths = {
  af: "acrossFlats",
  acrossflats: "acrossFlats",
  l: "length",
  length: "length",
  p: "threadPitch",
  threadpitch: "threadPitch",
  endchamfer: "endChamfer",
} as const
export function parseFemaleStandoffModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "femalestandoff" ||
    tokens[0]?.toLowerCase() !== "femalestandoff"
  )
    throw new Error("Expected femalestandoff without an inline argument")
  const props: Record<string, unknown> = { fn: "femalestandoff" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid female standoff token "${token}"`)
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown = value
    if (name === "m") {
      property = "metricSize"
      parsed = `M${value}`
    } else if (Object.hasOwn(lengths, name))
      property = lengths[name as keyof typeof lengths]
    else if (
      [
        "hex",
        "threadedthrough",
        "lefthand",
        "righthand",
        "threads",
        "nothreads",
      ].includes(name)
    ) {
      if (value) throw new Error("Female standoff flags cannot have values")
      if (name === "hex") {
        property = "hex"
        parsed = true
      } else if (name === "threadedthrough") {
        property = "threadedThrough"
        parsed = true
      } else if (name === "lefthand" || name === "righthand") {
        property = "leftHand"
        parsed = name === "lefthand"
      } else {
        property = "showThreads"
        parsed = name === "threads"
      }
    } else throw new Error(`Unknown female standoff token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate female standoff property "${property}"`)
    props[property] = parsed
  }
  return femaleStandoffModelDefinitionSchema.parse(props)
}
