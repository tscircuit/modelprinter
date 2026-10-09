import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { maleFemaleStandoffModelDefinitionSchema } from "./schema"

const lengths = {
  af: "acrossFlats",
  acrossflats: "acrossFlats",
  l: "length",
  length: "length",
  studl: "studLength",
  studlength: "studLength",
  femaledepth: "femaleDepth",
  threadpitch: "threadPitch",
  bodychamfer: "bodyChamfer",
  studchamfer: "studChamfer",
  mouthchamfer: "mouthChamfer",
} as const
const flags = {
  hex: ["hex", true],
  lefthanded: ["leftHand", true],
  righthanded: ["leftHand", false],
  threads: ["showThreads", true],
  nothreads: ["showThreads", false],
} as const
export function parseMaleFemaleStandoffModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "malefemalestandoff" ||
    tokens[0]?.toLowerCase() !== "malefemalestandoff"
  )
    throw new Error("Expected malefemalestandoff without an inline argument")
  const props: Record<string, unknown> = { fn: "malefemalestandoff" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let value: unknown
    if (Object.hasOwn(flags, lower)) {
      const entry = flags[lower as keyof typeof flags]
      property = entry[0]
      value = entry[1]
    } else {
      const match = token.match(/^([a-z]+)(.*)$/i)
      if (!match)
        throw new Error(`Invalid male-female standoff token "${token}"`)
      const name = match[1]!.toLowerCase()
      if (name === "m") {
        if (!/^\d+(?:\.\d+)?$/.test(match[2]!))
          throw new Error("Metric size must be a unitless nominal diameter")
        property = "metricSize"
        value = `M${match[2]}`
      } else if (Object.hasOwn(lengths, name)) {
        property = lengths[name as keyof typeof lengths]
        value = match[2]
      } else throw new Error(`Unknown male-female standoff token "${token}"`)
    }
    if (Object.hasOwn(props, property))
      throw new Error(
        `Duplicate or conflicting male-female standoff property "${property}"`,
      )
    props[property] = value
  }
  return maleFemaleStandoffModelDefinitionSchema.parse(props)
}
