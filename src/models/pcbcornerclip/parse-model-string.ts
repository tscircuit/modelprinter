import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pcbCornerClipModelDefinitionSchema } from "./schema"
const aliases = {
  w: "width",
  d: "depth",
  h: "height",
  wall: "wallThickness",
  floor: "floorThickness",
  board: "boardThickness",
  lip: "grooveDepth",
  slotz: "slotBottomZ",
  hole: "holeDiameter",
  width: "width",
  depth: "depth",
  height: "height",
  wallthickness: "wallThickness",
  floorthickness: "floorThickness",
  boardthickness: "boardThickness",
  groovedepth: "grooveDepth",
  slotbottomz: "slotBottomZ",
  holediameter: "holeDiameter",
} as const
export function parsePcbCornerClipModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "pcbcornerclip" || name?.toLowerCase() !== "pcbcornerclip")
    throw new Error("Expected pcbcornerclip without inline values")
  const props: Record<string, unknown> = { fn: "pcbcornerclip" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase(),
      value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed pcbcornerclip token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate pcbcornerclip property "${property}"`)
    props[property] = value
  }
  return pcbCornerClipModelDefinitionSchema.parse(props)
}
