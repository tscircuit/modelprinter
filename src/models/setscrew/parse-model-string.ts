import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { setscrewModelDefinitionSchema } from "./schema"
const aliases: Record<string, string> = {
  m: "metricSize",
  metricsize: "metricSize",
  l: "length",
  length: "length",
  d: "diameter",
  af: "socketAcrossFlats",
  diameter: "diameter",
  threadpitch: "threadPitch",
  socketacrossflats: "socketAcrossFlats",
  socketdepth: "socketDepth",
  cupdiameter: "cupDiameter",
  cupdepth: "cupDepth",
  pointtaperlength: "pointTaperLength",
  mouthchamfer: "mouthChamfer",
  threadrootdiameter: "threadRootDiameter",
  threadpitchdiameter: "threadPitchDiameter",
}
const flags: Record<string, string> = {
  hexsocket: "hexSocket",
  cuppoint: "cupPoint",
  lefthanded: "leftHand",
  righthanded: "leftHand",
  threads: "showThreads",
  nothreads: "showThreads",
}
export function parseSetScrewModelParams(raw: RawModelprinterParams) {
  if (raw.fn !== "setscrew") throw new Error("Expected setscrew params")
  const [root, ...tokens] = splitModelStringTokens(raw.string)
  if (root?.toLowerCase() !== "setscrew")
    throw new Error("The setscrew function does not accept an inline value")
  const props: Record<string, unknown> = {}
  for (const token of tokens) {
    if (token.toLowerCase() === "iso4029") {
      if ("iso4029" in props)
        throw new Error("Property iso4029 is set more than once")
      props.iso4029 = true
      continue
    }
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase() ?? ""
    const value = match?.[2] ?? ""
    let property: string
    let parsed: unknown
    if (flags[key]) {
      if (value) throw new Error(`Flag ${key} does not accept a value`)
      property = flags[key]!
      parsed = !["righthanded", "nothreads"].includes(key)
    } else {
      property = aliases[key] ?? ""
      if (!property || !value)
        throw new Error(`Unknown or missing setscrew token ${token}`)
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
  return setscrewModelDefinitionSchema.parse({ fn: "setscrew", ...props })
}
