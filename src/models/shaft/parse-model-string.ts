import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { shaftModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  diameter: "diameter",
  l: "length",
  length: "length",
  endchamfer: "endChamfer",
  chamfer: "endChamfer",
} as const

export function parseShaftModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "shaft" || tokens[0]?.toLowerCase() !== "shaft") {
    throw new Error("Expected shaft without an inline argument")
  }

  const props: Record<string, unknown> = { fn: "shaft" }
  const seen = new Set<string>()

  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    if (lower === "roundsolid") {
      if (seen.has("roundSolid")) {
        throw new Error('Duplicate shaft property "roundSolid"')
      }
      seen.add("roundSolid")
      props.roundSolid = true
      continue
    }

    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) {
      throw new Error(`Invalid shaft token "${token}"`)
    }
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    if (!Object.hasOwn(lengths, name)) {
      throw new Error(`Unknown shaft token "${token}"`)
    }
    const property = lengths[name as keyof typeof lengths]
    if (seen.has(property)) {
      throw new Error(`Duplicate shaft property "${property}"`)
    }
    seen.add(property)
    props[property] = value
  }

  return shaftModelDefinitionSchema.parse(props)
}
