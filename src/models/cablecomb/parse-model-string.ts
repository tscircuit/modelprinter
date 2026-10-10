import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cableCombModelDefinitionSchema } from "./schema"
const properties: Record<string, string> = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  d: "depth",
  depth: "depth",
  slots: "slotCount",
  slotcount: "slotCount",
  slotw: "slotWidth",
  slotwidth: "slotWidth",
  slotd: "slotDepth",
  slotdepth: "slotDepth",
  p: "slotPitch",
  slotpitch: "slotPitch",
  holes: "holeCount",
  hole: "holeDiameter",
  holediameter: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
}
export function parseCableCombModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "cablecomb" || tokens[0]?.toLowerCase() !== "cablecomb")
    throw new Error("Expected an unadorned cablecomb function")
  const props: Record<string, unknown> = {}
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase() ?? ""
    const property = properties[key]
    if (!property) throw new Error(`Unknown cablecomb token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate cablecomb property "${property}"`)
    const value = match![2]!
    if (!value) throw new Error(`Token "${key}" requires a value`)
    if (["slotCount", "holeCount"].includes(property)) {
      if (!/^\d+$/.test(value))
        throw new Error(`Token "${key}" requires a unitless integer`)
      props[property] = Number(value)
    } else if (property === "arcDegrees") {
      if (!/^(?:\d+(?:\.\d*)?|\.\d+)deg$/i.test(value))
        throw new Error(
          "Arc requires an angle in degrees, for example arc240deg",
        )
      props[property] = Number(value.slice(0, -3))
    } else props[property] = value
  }
  return cableCombModelDefinitionSchema.parse({ fn: "cablecomb", ...props })
}
