import { rigidCouplerModelDefinitionSchema } from "./rigid-coupler-schema"
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
  boreb: "boreBDiameter",
  l: "length",
  length: "length",
  screwcount: "screwCount",
  screwendoffset: "screwEndOffset",
  screwangle: "screwAngle",
}

export function parseRigidCouplerModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "rigidcoupler" || tokens[0]?.toLowerCase() !== "rigidcoupler")
    throw new Error("Expected an unadorned rigidcoupler function")
  const props: Record<string, unknown> = {}
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase() ?? ""
    const property = tokenProperties[name]
    if (!property) throw new Error(`Unknown rigidcoupler token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate rigidcoupler property "${property}"`)
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
    } else if (property === "screwCount") {
      if (!/^\d+$/.test(value))
        throw new Error("screwcount requires a unitless integer")
      props[property] = Number(value)
    } else if (property === "screwAngle") {
      if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:deg)?$/i.test(value))
        throw new Error("screwangle requires an angle in degrees")
      props[property] = Number(value.replace(/deg$/i, ""))
    } else {
      props[property] = value
    }
  }
  return rigidCouplerModelDefinitionSchema.parse({
    fn: "rigidcoupler",
    ...props,
  })
}
