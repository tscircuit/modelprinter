import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { hatSectionModelDefinitionSchema } from "./schema"
const aliases = {
  crownw: "crownWidth",
  h: "height",
  lip: "lipWidth",
  t: "thickness",
  bendr: "bendRadius",
  l: "length",
  crownwidth: "crownWidth",
  height: "height",
  lipwidth: "lipWidth",
  thickness: "thickness",
  bendradius: "bendRadius",
  length: "length",
} as const
export function parseHatSectionModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "hatsection" || name?.toLowerCase() !== "hatsection")
    throw new Error("Expected hatsection without inline values")
  const props: Record<string, unknown> = { fn: "hatsection" }
  for (const token of tokens) {
    const [key, value] = parseGearToken(token)
    if (!Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed hatsection token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Repeated hatsection property "${property}"`)
    props[property] = value
  }
  return hatSectionModelDefinitionSchema.parse(props)
}
