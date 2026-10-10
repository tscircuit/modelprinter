import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { uflModelDefinitionSchema } from "./schema"

const aliases = {
  p: "groundPitch",
  pw: "groundPadWidth",
  ph: "groundPadHeight",
  signalw: "signalPadWidth",
  signalh: "signalPadHeight",
  signalx: "signalPadX",
} as const

export function parseUflModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "ufl" || !/^ufl(?:3)?$/i.test(name ?? ""))
    throw new Error("Expected a three-terminal ufl receptacle")
  const props: Record<string, unknown> = { fn: "ufl" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed ufl token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate ufl property "${property}"`)
    props[property] = value
  }
  return uflModelDefinitionSchema.parse(props)
}
