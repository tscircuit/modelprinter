import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { maleStandoffModelDefinitionSchema } from "./schema"

const lengths = {
  af: "acrossFlats",
  acrossflats: "acrossFlats",
  l: "length",
  length: "length",
  studl: "studLength",
  studlength: "studLength",
  threadpitch: "threadPitch",
  chamfer: "bodyChamfer",
  bodychamfer: "bodyChamfer",
  studchamfer: "studChamfer",
} as const
const flags = {
  hex: ["hex", true],
  equalends: ["equalEnds", true],
  lefthanded: ["leftHand", true],
  righthanded: ["leftHand", false],
  threads: ["showThreads", true],
  nothreads: ["showThreads", false],
} as const
export function parseMaleStandoffModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "malestandoff" || tokens[0]?.toLowerCase() !== "malestandoff")
    throw new Error("Expected malestandoff without an inline argument")
  const props: Record<string, unknown> = { fn: "malestandoff" }
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
      if (!match) throw new Error(`Invalid male standoff token "${token}"`)
      const name = match[1]!.toLowerCase()
      if (name === "m") {
        if (!/^\d+(?:\.\d+)?$/.test(match[2]!))
          throw new Error("Metric size must be a unitless nominal diameter")
        property = "metricSize"
        value = `M${match[2]}`
      } else if (Object.hasOwn(lengths, name)) {
        if (!match[2]) throw new Error(`Missing value in token "${token}"`)
        property = lengths[name as keyof typeof lengths]
        value = match[2]
      } else throw new Error(`Unknown male standoff token "${token}"`)
    }
    if (Object.hasOwn(props, property))
      throw new Error(
        `Duplicate or conflicting male standoff property "${property}"`,
      )
    props[property] = value
  }
  return maleStandoffModelDefinitionSchema.parse(props)
}
