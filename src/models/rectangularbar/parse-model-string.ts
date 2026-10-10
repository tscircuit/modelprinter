import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { rectangularBarModelDefinitionSchema } from "./schema"
const aliases = {
  w: "width",
  h: "height",
  l: "length",
  cornerr: "cornerRadius",
  width: "width",
  height: "height",
  length: "length",
  cornerradius: "cornerRadius",
} as const
export function parseRectangularBarModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "rectangularbar" || name?.toLowerCase() !== "rectangularbar")
    throw new Error("Expected rectangularbar without inline values")
  const props: Record<string, unknown> = { fn: "rectangularbar" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed rectangularbar token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate rectangularbar property "${property}"`)
    props[property] = value
  }
  return rectangularBarModelDefinitionSchema.parse(props)
}
