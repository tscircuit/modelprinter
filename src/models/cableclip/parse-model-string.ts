import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cableClipModelDefinitionSchema } from "./schema"
const properties: Record<string, string> = {
  cable: "cableDiameter",
  cablediameter: "cableDiameter",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  t: "thickness",
  thickness: "thickness",
  arc: "arcDegrees",
  tab: "tabLength",
  tablength: "tabLength",
  hole: "holeDiameter",
  holediameter: "holeDiameter",
}
export function parseCableClipModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "cableclip" || tokens[0]?.toLowerCase() !== "cableclip")
    throw new Error("Expected an unadorned cableclip function")
  const props: Record<string, unknown> = {}
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase() ?? ""
    const property = properties[key]
    if (!property) throw new Error(`Unknown cableclip token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate cableclip property "${property}"`)
    const value = match![2]!
    if (!value) throw new Error(`Token "${key}" requires a value`)
    if (([] as string[]).includes(property)) {
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
  return cableClipModelDefinitionSchema.parse({ fn: "cableclip", ...props })
}
