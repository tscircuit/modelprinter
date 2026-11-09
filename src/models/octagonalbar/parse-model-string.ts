import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { octagonalBarModelDefinitionSchema } from "./schema"

const lengths = {
  af: "acrossFlats",
  acrossflats: "acrossFlats",
  l: "length",
  length: "length",
  cornerr: "cornerRadius",
  cornerradius: "cornerRadius",
} as const

export function parseOctagonalBarModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "octagonalbar" || name?.toLowerCase() !== "octagonalbar")
    throw new Error("Expected octagonalbar without an inline value")

  const props: Record<string, unknown> = { fn: "octagonalbar" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    let property: string
    let parsed: unknown = value
    if (key === "regular") {
      property = "regular"
      if (value !== "") throw new Error("regular is a value-free flag")
      parsed = true
    } else if (key && value && Object.hasOwn(lengths, key)) {
      property = lengths[key as keyof typeof lengths]
    } else {
      throw new Error(`Unknown or malformed octagonalbar token "${token}"`)
    }
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate octagonalbar property "${property}"`)
    props[property] = parsed
  }
  return octagonalBarModelDefinitionSchema.parse(props)
}
