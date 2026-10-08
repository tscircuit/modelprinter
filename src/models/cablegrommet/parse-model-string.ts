import { expandModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags } from "./string-flags"
import { cableGrommetModelDefinitionSchema } from "./schema"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"

const lengths = {
  panelhole: "panelHoleDiameter",
  panelholediameter: "panelHoleDiameter",
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  h: "height",
  height: "height",
  groovew: "grooveWidth",
  groovewidth: "grooveWidth",
  grooved: "grooveDepth",
  groovedepth: "grooveDepth",
} as const

export function parseCableGrommetModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(
    expandModelStringFlags(raw.string, stringFlags),
  )
  if (raw.fn !== "cablegrommet" || !/^cablegrommet$/i.test(tokens[0]!))
    throw new Error("Expected cablegrommet without an inline value")
  const props: Record<string, unknown> = { fn: "cablegrommet" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!name || !value) throw new Error(`Invalid grommet token "${token}"`)
    let property: string
    let parsed: unknown = value
    if (name in lengths) property = lengths[name as keyof typeof lengths]
    else if (name === "shape") {
      property = "shape"
      const selector = value.match(/^\(([a-z]+)\)$/i)
      if (!selector) throw new Error("Grommet shape requires parentheses")
      parsed = selector[1]!.toLowerCase()
    } else throw new Error(`Unknown grommet token "${token}"`)
    if (property in props)
      throw new Error(`Grommet property "${property}" is set more than once`)
    props[property] = parsed
  }
  return cableGrommetModelDefinitionSchema.parse(props)
}
