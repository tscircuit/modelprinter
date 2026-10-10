import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { sandwichMountModelDefinitionSchema } from "./schema"
const aliases = {
  w: "width",
  l: "length",
  h: "height",
  holepitch: "holePitch",
  holed: "holeDiameter",
  coreh: "coreHeight",
  platethickness: "plateThickness",
  width: "width",
  length: "length",
  height: "height",
  holediameter: "holeDiameter",
  coreheight: "coreHeight",
} as const
export function parseSandwichMountModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "sandwichmount" || name?.toLowerCase() !== "sandwichmount")
    throw new Error("Expected sandwichmount without inline values")
  const props: Record<string, unknown> = { fn: "sandwichmount" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed sandwichmount token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate sandwichmount property "${property}"`)
    props[property] = value
  }
  return sandwichMountModelDefinitionSchema.parse(props)
}
