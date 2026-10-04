import type { RawModelprinterParams } from "./parse-model-string"
import {
  femaleStandoffModelDefinitionSchema,
  maleFemaleStandoffModelDefinitionSchema,
} from "./standoff-schema"

const standoffPropertyByToken = {
  m: "metricSize",
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  stud: "studLength",
  studlength: "studLength",
} as const

export const parseStandoffModelParams = (raw: RawModelprinterParams) => {
  if (raw.fn !== "femalestandoff" && raw.fn !== "malefemalestandoff") {
    throw new Error(`Expected standoff params, got "${raw.fn}"`)
  }
  const tokens = raw.string.split("_")
  if (tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Standoff functions do not accept an inline value")
  }
  const props: Record<string, unknown> = {}
  for (const token of tokens.slice(1)) {
    const name = token.match(/^[a-z]+/i)?.[0]?.toLowerCase()
    if (!name || !Object.hasOwn(standoffPropertyByToken, name)) {
      throw new Error(`Unknown standoff model token "${token}"`)
    }
    const property =
      standoffPropertyByToken[name as keyof typeof standoffPropertyByToken]
    if (raw.fn === "femalestandoff" && property === "studLength") {
      throw new Error("Female standoffs do not have a male stud")
    }
    if (property in props) {
      throw new Error(`Standoff property "${property}" is set more than once`)
    }
    props[property] =
      property === "metricSize" ? `M${String(raw[name])}` : raw[name]
  }
  return raw.fn === "femalestandoff"
    ? femaleStandoffModelDefinitionSchema.parse({ fn: raw.fn, ...props })
    : maleFemaleStandoffModelDefinitionSchema.parse({ fn: raw.fn, ...props })
}
