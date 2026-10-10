import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cornerFootModelDefinitionSchema } from "./schema"
const lengths: Record<string, string> = {
  w: "width",
  d: "depth",
  h: "height",
  wall: "wallThickness",
  base: "baseThickness",
  seatw: "seatWidth",
  seatd: "seatDepth",
  hole: "holeDiameter",
  width: "width",
  depth: "depth",
  height: "height",
  wallthickness: "wallThickness",
  basethickness: "baseThickness",
  seatwidth: "seatWidth",
  seatdepth: "seatDepth",
  holediameter: "holeDiameter",
}
const flags: Record<string, string> = { cornercup: "cornerCup" }
const selectors: Record<string, { value: string; property: string }> = {
  shape: { value: "cornercup", property: "cornerCup" },
}
const integers: Record<string, string> = {}
const tuples: Record<string, readonly [string, string]> = {
  seat: ["seatWidth", "seatDepth"],
}
export function parseCornerFootModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "cornerfoot" || name?.toLowerCase() !== "cornerfoot")
    throw new Error("Expected cornerfoot without inline values")
  const props: Record<string, unknown> = { fn: "cornerfoot" }
  const assign = (property: string, value: unknown) => {
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate cornerfoot property "${property}"`)
    props[property] = value
  }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Malformed cornerfoot token "${token}"`)
    const key = match[1]!.toLowerCase(),
      value = match[2]!
    if (Object.hasOwn(lengths, key) && value) assign(lengths[key]!, value)
    else if (Object.hasOwn(flags, key) && !value) assign(flags[key]!, true)
    else if (
      Object.hasOwn(selectors, key) &&
      value.toLowerCase() === `(${selectors[key]!.value})`
    )
      assign(selectors[key]!.property, true)
    else if (Object.hasOwn(integers, key) && /^\d+$/.test(value))
      assign(integers[key]!, Number(value))
    else if (Object.hasOwn(tuples, key)) {
      const pair = value.match(/^\(([^(),]+),([^(),]+)\)$/)
      if (!pair)
        throw new Error(`Token "${key}" requires two parenthesized lengths`)
      assign(tuples[key]![0], pair[1]!.trim())
      assign(tuples[key]![1], pair[2]!.trim())
    } else throw new Error(`Unknown or malformed cornerfoot token "${token}"`)
  }
  return cornerFootModelDefinitionSchema.parse(props)
}
