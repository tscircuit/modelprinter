import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { vBlockModelDefinitionSchema } from "./schema"
const aliases = {
  l: "length",
  w: "width",
  h: "height",
  vangle: "grooveAngle",
  vdepth: "grooveDepth",
  mountgroovew: "mountGrooveWidth",
  mountgrooved: "mountGrooveDepth",
  mountz: "mountGrooveZ",
  length: "length",
  width: "width",
  height: "height",
  grooveangle: "grooveAngle",
  groovedepth: "grooveDepth",
  mountgroovewidth: "mountGrooveWidth",
  mountgroovedepth: "mountGrooveDepth",
  mountgroovez: "mountGrooveZ",
} as const
export function parseVBlockModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "vblock" || name?.toLowerCase() !== "vblock")
    throw new Error("Expected vblock without inline values")
  const props: Record<string, unknown> = { fn: "vblock" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed vblock token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate vblock property "${property}"`)
    props[property] = value
  }
  return vBlockModelDefinitionSchema.parse(props)
}
