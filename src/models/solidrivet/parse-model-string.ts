import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { solidRivetModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  diameter: "diameter",
  l: "length",
  length: "length",
  headod: "headDiameter",
  headdiameter: "headDiameter",
  headh: "headHeight",
  headheight: "headHeight",
} as const

const flags = {
  roundhead: "roundHead",
  flattail: "flatTail",
  unset: "unset",
} as const

const selectors = {
  spec: { property: "specification", value: "custom", resolved: "custom" },
  head: { property: "roundHead", value: "round", resolved: true },
  tail: { property: "flatTail", value: "flat", resolved: true },
  state: { property: "unset", value: "unset", resolved: true },
} as const

export function parseSolidRivetModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "solidrivet" || tokens[0]?.toLowerCase() !== "solidrivet")
    throw new Error("Expected solidrivet without an inline value")

  const props: Record<string, unknown> = { fn: "solidrivet" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid solid rivet token "${token}"`)
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown

    if (Object.hasOwn(lengths, name)) {
      property = lengths[name as keyof typeof lengths]
      parsed = value
    } else if (Object.hasOwn(flags, name)) {
      if (value) throw new Error(`Solid rivet flag "${name}" takes no value`)
      property = flags[name as keyof typeof flags]
      parsed = true
    } else if (Object.hasOwn(selectors, name)) {
      const selector = selectors[name as keyof typeof selectors]
      if (value.toLowerCase() !== `(${selector.value})`)
        throw new Error(`Solid rivet ${name} requires (${selector.value})`)
      property = selector.property
      parsed = selector.resolved
    } else throw new Error(`Unknown solid rivet token "${token}"`)

    if (Object.hasOwn(props, property))
      throw new Error(
        `Solid rivet property "${property}" is set more than once`,
      )
    props[property] = parsed
  }
  return solidRivetModelDefinitionSchema.parse(props)
}
