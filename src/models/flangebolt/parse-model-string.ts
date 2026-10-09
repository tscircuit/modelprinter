import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { flangeboltModelDefinitionSchema } from "./schema"
const aliases: Record<string, string> = {
  m: "metricSize",
  metricsize: "metricSize",
  l: "length",
  length: "length",
  d: "diameter",
  af: "headAcrossFlats",
  diameter: "diameter",
  threadpitch: "threadPitch",
  headacrossflats: "headAcrossFlats",
  headheight: "headHeight",
  flangediameter: "flangeDiameter",
  flangethickness: "flangeThickness",
  underheadradius: "underHeadRadius",
  tipchamfer: "tipChamfer",
  headchamferangle: "headChamferAngle",
  headchamferdiameter: "headChamferDiameter",
  headcornerdiameter: "headCornerDiameter",
  flangeslopeangle: "flangeSlopeAngle",
  threadrootdiameter: "threadRootDiameter",
  threadpitchdiameter: "threadPitchDiameter",
}
const flags: Record<string, string> = {
  fullthread: "fullThread",
  plainface: "plainFace",
  lefthanded: "leftHand",
  righthanded: "leftHand",
  threads: "showThreads",
  nothreads: "showThreads",
}
export function parseFlangeBoltModelParams(raw: RawModelprinterParams) {
  if (raw.fn !== "flangebolt") throw new Error("Expected flangebolt params")
  const [root, ...tokens] = splitModelStringTokens(raw.string)
  if (root?.toLowerCase() !== "flangebolt")
    throw new Error("The flangebolt function does not accept an inline value")
  const props: Record<string, unknown> = {}
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase() ?? ""
    const value = match?.[2] ?? ""
    let property: string
    let parsed: unknown
    if (token.toLowerCase() === "iso4162") {
      property = "iso4162"
      parsed = true
    } else if (flags[key]) {
      if (value) throw new Error(`Flag ${key} does not accept a value`)
      property = flags[key]!
      parsed = !["righthanded", "nothreads"].includes(key)
    } else {
      if (key === "standard" || key === "headstandard")
        throw new Error(
          "ISO 4162 is the default head/flange envelope; use the bare iso4162 flag or omit it. Full threading is an extension of ISO 4162",
        )
      property = aliases[key] ?? ""
      if (!property || !value)
        throw new Error(`Unknown or missing flangebolt token ${token}`)
      if (property === "metricSize") {
        const size =
          key === "m" ? value : value.match(/^\((m\d+)\)$/i)?.[1]?.slice(1)
        if (!size || !/^\d+$/.test(size)) throw new Error("Invalid metric size")
        parsed = `M${size}`
      } else {
        if (!/^(?:\d+(?:\.\d+)?|\.\d+)(?:mm|cm|m|in|inch)?$/i.test(value))
          throw new Error(`Invalid dimension token ${token}`)
        if (property.endsWith("Angle")) {
          if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(value))
            throw new Error("Angles require unitless degrees")
          parsed = Number(value)
        } else parsed = value
      }
    }
    if (property in props)
      throw new Error(`Property ${property} is set more than once`)
    props[property] = parsed
  }
  return flangeboltModelDefinitionSchema.parse({ fn: "flangebolt", ...props })
}
