import { expandModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags } from "./string-flags"
import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tSlotGussetModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  t: "thickness",
  thickness: "thickness",
  edgemargin: "edgeMargin",
} as const

export function parseTSlotGussetModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(
    expandModelStringFlags(raw.string, stringFlags),
  )
  if (raw.fn !== "tslotgusset" || tokens[0]?.toLowerCase() !== raw.fn)
    throw new Error("Expected tslotgusset without an inline value")
  const props: Record<string, unknown> = { fn: "tslotgusset" }
  for (const token of tokens.slice(1)) {
    const [name, value] = parseGearToken(token)
    let property: string
    let parsed: unknown = value
    if (name in lengths) property = lengths[name as keyof typeof lengths]
    else if (name === "slots" || name === "slotcount") {
      property = "slotCount"
      parsed = parseGearInteger(value, "slotCount")
    } else if (name === "shape") {
      property = "shape"
      const match = value.match(/^\(([a-z]+)\)$/i)
      if (!match) throw new Error("Shape requires one parenthesized identity")
      parsed = match[1]!.toLowerCase()
    } else if (name === "slot" || name === "centers") {
      property = name
      const match = value.match(/^\(([^(),]+),([^(),]+)\)$/)
      if (!match) throw new Error(`${name} requires two parenthesized lengths`)
      parsed = [match[1]!.trim(), match[2]!.trim()]
    } else throw new Error(`Unknown T-slot gusset token "${token}"`)
    if (property in props)
      throw new Error(`T-slot gusset property "${property}" is repeated`)
    props[property] = parsed
  }
  return tSlotGussetModelDefinitionSchema.parse(props)
}
