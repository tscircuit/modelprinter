import { expandModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags } from "./string-flags"
import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tSlotExtrusionModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  l: "length",
  length: "length",
  slot: "slotWidth",
  slotwidth: "slotWidth",
  pocket: "pocketWidth",
  pocketwidth: "pocketWidth",
  pocketd: "pocketDepth",
  pocketdepth: "pocketDepth",
  lip: "lipThickness",
  lipthickness: "lipThickness",
  bore: "boreDiameter",
  borediameter: "boreDiameter",
  corner: "cornerRadius",
  cornerradius: "cornerRadius",
} as const

export function parseTSlotExtrusionModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(
    expandModelStringFlags(raw.string, stringFlags),
  )
  if (raw.fn !== "tslotextrusion" || tokens[0]?.toLowerCase() !== raw.fn)
    throw new Error("Expected tslotextrusion without an inline value")
  const props: Record<string, unknown> = { fn: "tslotextrusion" }
  for (const token of tokens.slice(1)) {
    const [name, value] = parseGearToken(token)
    let property: string
    let parsed: unknown = value
    if (name in lengths) property = lengths[name as keyof typeof lengths]
    else if (name === "profile") {
      property = "profile"
      const match = value.match(/^\(([a-z]+)\)$/i)
      if (!match) throw new Error("Profile requires one parenthesized identity")
      parsed = match[1]!.toLowerCase()
    } else throw new Error(`Unknown T-slot extrusion token "${token}"`)
    if (property in props)
      throw new Error(`T-slot extrusion property "${property}" is repeated`)
    props[property] = parsed
  }
  return tSlotExtrusionModelDefinitionSchema.parse(props)
}
