import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { hollowHexBarModelDefinitionSchema } from "./schema"

const lengths = {
  outeraf: "outerAcrossFlats",
  outeracrossflats: "outerAcrossFlats",
  inneraf: "innerAcrossFlats",
  inneracrossflats: "innerAcrossFlats",
  l: "length",
  length: "length",
  cornerr: "cornerRadius",
  cornerradius: "cornerRadius",
} as const

export function parseHollowHexBarModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "hollowhexbar" || name?.toLowerCase() !== "hollowhexbar")
    throw new Error("Expected hollowhexbar without an inline value")

  const props: Record<string, unknown> = { fn: "hollowhexbar" }
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
      throw new Error(`Unknown or malformed hollowhexbar token "${token}"`)
    }
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate hollowhexbar property "${property}"`)
    props[property] = parsed
  }
  return hollowHexBarModelDefinitionSchema.parse(props)
}
