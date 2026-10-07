import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { leadScrewNutModelDefinitionSchema } from "./schema"
const lengths = {
  l: "length",
  length: "length",
  bodyod: "bodyDiameter",
  bodydiameter: "bodyDiameter",
  clearance: "radialClearance",
  borechamfer: "boreChamfer",
  flangeod: "flangeDiameter",
  flangediameter: "flangeDiameter",
  flanget: "flangeThickness",
  flangethickness: "flangeThickness",
  hole: "mountHoleDiameter",
  holediameter: "mountHoleDiameter",
  bcd: "mountHoleCircleDiameter",
  pitch: "threadPitch",
  threadpitch: "threadPitch",
  lead: "threadLead",
  threadlead: "threadLead",
} as const
const enums = {
  profile: "profile",
  hand: "threadHand",
  threadhand: "threadHand",
  style: "style",
} as const
export function parseLeadScrewNutModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "leadscrewnut" || tokens[0]?.toLowerCase() !== "leadscrewnut")
    throw new Error("Expected leadscrewnut without an inline value")
  const props: Record<string, unknown> = { fn: "leadscrewnut" }
  for (const token of tokens.slice(1)) {
    const designation = token.match(/^tr8x(2|8\(p2\))$/i)
    let property: string, parsed: unknown
    if (designation) {
      property = "threadSize"
      parsed = designation[1] === "2" ? "TR8x2" : "TR8x8(P2)"
    } else {
      const match = token.match(/^([a-z]+)(.*)$/i)
      if (!match) throw new Error("Invalid leadscrewnut token: " + token)
      const name = match[1]!.toLowerCase(),
        value = match[2]!
      if (Object.hasOwn(lengths, name)) {
        property = lengths[name as keyof typeof lengths]
        parsed = value
      } else if (Object.hasOwn(enums, name)) {
        property = enums[name as keyof typeof enums]
        const wrapped = value.match(/^\(([a-z0-9:]+)\)$/i)
        if (!wrapped)
          throw new Error("Expected a parenthesized value for " + name)
        parsed = wrapped[1]!.toLowerCase()
      } else if (name === "starts" || name === "holes") {
        property = name === "starts" ? "threadStarts" : "mountHoleCount"
        if (!/^\d+$/.test(value))
          throw new Error("Count must be a unitless integer")
        parsed = Number(value)
      } else throw new Error("Unknown leadscrewnut token: " + token)
    }
    if (Object.hasOwn(props, property))
      throw new Error("Duplicate leadscrewnut property: " + property)
    props[property] = parsed
  }
  return leadScrewNutModelDefinitionSchema.parse(props)
}
