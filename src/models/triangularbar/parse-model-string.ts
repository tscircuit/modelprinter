import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { triangularBarModelDefinitionSchema } from "./schema"

const lengths = {
  side: "sideLength",
  sidelength: "sideLength",
  l: "length",
  length: "length",
  cornerr: "cornerRadius",
  cornerradius: "cornerRadius",
} as const

export function parseTriangularBarModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "triangularbar" || name?.toLowerCase() !== "triangularbar")
    throw new Error("Expected triangularbar without an inline value")
  const props: Record<string, unknown> = { fn: "triangularbar" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid triangularbar token "${token}"`)
    const key = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown = value
    if (Object.hasOwn(lengths, key)) {
      property = lengths[key as keyof typeof lengths]
    } else if (key === "equilateral") {
      property = "equilateral"
      if (value !== "") throw new Error("equilateral is a value-free flag")
      parsed = true
    } else throw new Error(`Unknown triangularbar token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate triangularbar property "${property}"`)
    props[property] = parsed
  }
  return triangularBarModelDefinitionSchema.parse(props)
}
