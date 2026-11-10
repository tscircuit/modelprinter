import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { torsionBarModelDefinitionSchema } from "./schema"

const aliases = {
  d: "diameter",
  diameter: "diameter",
  l: "length",
  length: "length",
  endaf: "endAcrossFlats",
  endacrossflats: "endAcrossFlats",
  endl: "endLength",
  endlength: "endLength",
  transition: "transitionLength",
  transitionlength: "transitionLength",
} as const

export function parseTorsionBarModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "torsionbar" || name?.toLowerCase() !== "torsionbar")
    throw new Error("Expected torsionbar without an inline value")

  const props: Record<string, unknown> = { fn: "torsionbar" }
  for (const token of tokens) {
    const [key, value] = parseGearToken(token)
    let property: string
    let parsed: unknown = value
    if (key === "hexends") {
      if (value) throw new Error("hexends is a value-free flag")
      property = "hexEnds"
      parsed = true
    } else if (value && Object.hasOwn(aliases, key)) {
      property = aliases[key as keyof typeof aliases]
    } else {
      throw new Error(`Unknown or malformed torsionbar token "${token}"`)
    }
    if (Object.hasOwn(props, property))
      throw new Error(`Repeated torsionbar property "${property}"`)
    props[property] = parsed
  }
  return torsionBarModelDefinitionSchema.parse(props)
}
