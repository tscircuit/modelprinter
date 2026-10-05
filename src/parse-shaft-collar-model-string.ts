import { shaftCollarModelDefinitionSchema } from "./shaft-collar-schema"
import type { RawModelprinterParams } from "./parse-model-string"
import { splitModelStringTokens } from "./split-model-string-tokens"

const tokenProperties: Record<string, string> = {
  bore: "boreDiameter",
  od: "outerDiameter",
  mount: "mount",
  m: "metricSize",
  threadpitch: "threadPitch",
  threadhand: "threadHand",
  threadclass: "threadClass",
  chamfer: "chamfer",
  w: "width",
  width: "width",
  screwz: "screwZ",
  screwangle: "screwAngle",
}

export function parseShaftCollarModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "shaftcollar" || tokens[0]?.toLowerCase() !== "shaftcollar")
    throw new Error("Expected an unadorned shaftcollar function")
  const props: Record<string, unknown> = {}
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase() ?? ""
    const property = tokenProperties[name]
    if (!property) throw new Error(`Unknown shaftcollar token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate shaftcollar property "${property}"`)
    const value = match![2]!
    if (!value) throw new Error(`Token "${name}" requires a value`)
    if (["mount", "threadHand", "threadClass"].includes(property)) {
      const argument = value.match(/^\(([^()]+)\)$/)
      if (!argument)
        throw new Error(`Token "${name}" requires one parenthesized argument`)
      props[property] =
        property === "threadClass"
          ? argument[1]!.toUpperCase()
          : argument[1]!.toLowerCase()
    } else if (property === "metricSize") {
      if (!/^\d+(?:\.\d+)?$/.test(value))
        throw new Error("m requires a unitless metric designation")
      props[property] = `M${value}`
    } else if (property === "screwAngle") {
      if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:deg)?$/i.test(value))
        throw new Error("screwangle requires an angle in degrees")
      props[property] = Number(value.replace(/deg$/i, ""))
    } else {
      props[property] = value
    }
  }
  return shaftCollarModelDefinitionSchema.parse({ fn: "shaftcollar", ...props })
}
