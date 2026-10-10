import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { angleBarModelDefinitionSchema } from "./schema"
const aliases = {
  w: "width",
  h: "height",
  t: "thickness",
  l: "length",
  innerr: "innerRadius",
  tipr: "tipRadius",
  width: "width",
  height: "height",
  thickness: "thickness",
  length: "length",
  innerradius: "innerRadius",
  tipradius: "tipRadius",
} as const
export function parseAngleBarModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "anglebar" || name?.toLowerCase() !== "anglebar")
    throw new Error("Expected anglebar without inline values")
  const props: Record<string, unknown> = { fn: "anglebar" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed anglebar token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate anglebar property "${property}"`)
    props[property] = value
  }
  return angleBarModelDefinitionSchema.parse(props)
}
