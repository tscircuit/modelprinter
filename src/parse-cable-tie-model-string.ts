import { cableTieModelDefinitionSchema } from "./cable-tie-schema"
import type { RawModelprinterParams } from "./parse-model-string"
import { splitModelStringTokens } from "./split-model-string-tokens"

const lengths = {
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  t: "thickness",
  thickness: "thickness",
  headlength: "headLength",
  headwidth: "headWidth",
  headheight: "headHeight",
  toothp: "toothPitch",
  toothpitch: "toothPitch",
} as const

export function parseCableTieModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "cabletie" || !/^cabletie$/i.test(tokens[0]!))
    throw new Error("Expected cabletie without an inline value")
  const props: Record<string, unknown> = { fn: "cabletie" }
  const assign = (property: string, value: unknown) => {
    if (property in props)
      throw new Error(`Cable tie property "${property}" is set more than once`)
    props[property] = value
  }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!name || !value) throw new Error(`Invalid cable tie token "${token}"`)
    if (name in lengths) assign(lengths[name as keyof typeof lengths], value)
    else if (name === "head") {
      const tuple = value.match(/^\(([^()]*)\)$/)?.[1]?.split(",")
      if (tuple?.length !== 3)
        throw new Error("Cable tie head requires (length,width,height)")
      for (const [index, property] of [
        "headLength",
        "headWidth",
        "headHeight",
      ].entries())
        assign(property, tuple[index])
    } else if (name === "type") {
      const selector = value.match(/^\(([a-z]+)\)$/i)
      if (!selector) throw new Error("Cable tie type requires parentheses")
      assign("type", selector[1]!.toLowerCase())
    } else throw new Error(`Unknown cable tie token "${token}"`)
  }
  return cableTieModelDefinitionSchema.parse(props)
}
