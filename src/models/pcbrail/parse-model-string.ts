import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pcbRailModelDefinitionSchema } from "./schema"
const aliases = {
  l: "length",
  w: "width",
  h: "height",
  wall: "wallThickness",
  floor: "floorThickness",
  slotw: "slotWidth",
  slotd: "slotDepth",
  slotz: "slotBottomZ",
  tabl: "tabLength",
  tabw: "tabWidth",
  hole: "holeDiameter",
  hp: "holePitch",
  length: "length",
  width: "width",
  height: "height",
  wallthickness: "wallThickness",
  floorthickness: "floorThickness",
  slotwidth: "slotWidth",
  slotdepth: "slotDepth",
  slotbottomz: "slotBottomZ",
  tablength: "tabLength",
  tabwidth: "tabWidth",
  holediameter: "holeDiameter",
  holepitch: "holePitch",
} as const
export function parsePcbRailModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "pcbrail" || name?.toLowerCase() !== "pcbrail")
    throw new Error("Expected pcbrail without inline values")
  const props: Record<string, unknown> = { fn: "pcbrail" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase(),
      value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed pcbrail token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate pcbrail property "${property}"`)
    props[property] = value
  }
  return pcbRailModelDefinitionSchema.parse(props)
}
