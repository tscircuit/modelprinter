import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { halfRoundBarModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  diameter: "diameter",
  l: "length",
  length: "length",
  edger: "edgeRadius",
  edgeradius: "edgeRadius",
} as const

export function parseHalfRoundBarModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "halfroundbar" || name?.toLowerCase() !== "halfroundbar")
    throw new Error("Expected halfroundbar without an inline value")

  const props: Record<string, unknown> = { fn: "halfroundbar" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    let property: string
    let parsed: unknown = value
    if (key === "diametral") {
      property = "diametral"
      if (value !== "") throw new Error("diametral is a value-free flag")
      parsed = true
    } else if (key && value && Object.hasOwn(lengths, key)) {
      property = lengths[key as keyof typeof lengths]
    } else {
      throw new Error(`Unknown or malformed halfroundbar token "${token}"`)
    }
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate halfroundbar property "${property}"`)
    props[property] = parsed
  }
  return halfRoundBarModelDefinitionSchema.parse(props)
}
