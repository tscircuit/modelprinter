import { hexBoltModelDefinitionSchema } from "./hex-bolt-schema"
import type { RawModelprinterParams } from "./parse-model-string"
import { splitModelStringTokens } from "./split-model-string-tokens"

const aliases: Record<string, string> = {
  m: "metricSize",
  metricsize: "metricSize",
  l: "length",
  length: "length",
  standard: "standard",
  thread: "thread",
  drive: "drive",
  threadhand: "threadHand",
  threadclass: "threadClass",
  threadgender: "threadGender",
  diameter: "diameter",
  threadpitch: "threadPitch",
  headacrossflats: "headAcrossFlats",
  headheight: "headHeight",
  underheadradius: "underHeadRadius",
  headchamferangle: "headChamferAngle",
  tipchamferangle: "tipChamferAngle",
  threadflankangle: "threadFlankAngle",
  tipchamfer: "tipChamfer",
  threadrootdiameter: "threadRootDiameter",
  threadpitchdiameter: "threadPitchDiameter",
  headcornerdiameter: "headCornerDiameter",
  headchamferdiameter: "headChamferDiameter",
  d: "diameter",
  headh: "headHeight",
  af: "headAcrossFlats",
}
const selectors = new Set([
  "standard",
  "thread",
  "drive",
  "threadHand",
  "threadClass",
  "threadGender",
])

export const parseHexBoltModelParams = (raw: RawModelprinterParams) => {
  if (raw.fn !== "hexbolt")
    throw new Error(`Expected hexbolt params, got "${raw.fn}"`)
  const [root, ...tokens] = splitModelStringTokens(raw.string)
  if (root?.toLowerCase() !== "hexbolt")
    throw new Error("The hexbolt function does not accept an inline value")
  const props: Record<string, unknown> = {}
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    let property: string
    let parsed: unknown
    if (key === "threads" || key === "nothreads") {
      if (value !== "")
        throw new Error(`Token "${key}" does not accept a value`)
      property = "showThreads"
      parsed = key === "threads"
    } else {
      property = key ? (aliases[key] ?? "") : ""
      if (!property || !value)
        throw new Error(`Unknown or missing hexbolt token "${token}"`)
      if (selectors.has(property)) {
        const selector = value.match(/^\(([^()]+)\)$/)?.[1]
        if (!selector)
          throw new Error(`Token "${key}" requires a parenthesized selector`)
        parsed = selector.toLowerCase()
      } else if (property === "metricSize") {
        const size =
          key === "m" ? value : value.match(/^\((m\d+)\)$/i)?.[1]?.slice(1)
        if (!size || !/^\d+$/.test(size)) throw new Error("Invalid metric size")
        parsed = `M${size}`
      } else {
        // Length grammar deliberately excludes mm()'s permissive numeric prefixes.
        if (!/^(?:\d+(?:\.\d+)?|\.\d+)(?:mm|cm|m|in|inch)?$/i.test(value)) {
          throw new Error(`Invalid dimension token "${token}"`)
        }
        parsed = [
          "headChamferAngle",
          "tipChamferAngle",
          "threadFlankAngle",
        ].includes(property)
          ? Number(value)
          : value
      }
    }
    if (property in props)
      throw new Error(`Property "${property}" is set more than once`)
    props[property] = parsed
  }
  return hexBoltModelDefinitionSchema.parse({ fn: "hexbolt", ...props })
}
