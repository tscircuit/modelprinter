import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { wedgeBlankModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  tip: "tipHeight",
  tipheight: "tipHeight",
  edger: "edgeRadius",
  edgeradius: "edgeRadius",
} as const

export function parseWedgeBlankModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "wedgeblank" || name?.toLowerCase() !== "wedgeblank")
    throw new Error("Expected wedgeblank without an inline value")

  const props: Record<string, unknown> = { fn: "wedgeblank" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    let property: string
    let parsed: unknown = value
    if (key === "lengthwise") {
      property = "lengthwise"
      if (value !== "") throw new Error("lengthwise is a value-free flag")
      parsed = true
    } else if (key && value && Object.hasOwn(lengths, key)) {
      property = lengths[key as keyof typeof lengths]
    } else {
      throw new Error(`Unknown or malformed wedgeblank token "${token}"`)
    }
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate wedgeblank property "${property}"`)
    props[property] = parsed
  }
  return wedgeBlankModelDefinitionSchema.parse(props)
}
