import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { splitWasherModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  t: "thickness",
  thickness: "thickness",
  rise: "rise",
} as const

export function parseSplitWasherModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "splitwasher" || tokens[0]?.toLowerCase() !== "splitwasher")
    throw new Error("Expected splitwasher without an inline value")
  const props: Record<string, unknown> = { fn: "splitwasher" }
  for (const token of tokens.slice(1)) {
    const flag = token.toLowerCase()
    let property: string, value: unknown
    if (flag === "rectangular") {
      property = "rectangular"
      value = true
    } else if (["righthanded", "lefthanded", "right", "left"].includes(flag)) {
      property = "leftHanded"
      value = flag === "lefthanded" || flag === "left"
    } else {
      const match = token.match(/^([a-z]+)(.*)$/i)
      const name = match?.[1]?.toLowerCase(),
        suffix = match?.[2]
      if (!name || !suffix)
        throw new Error(`Invalid split washer token "${token}"`)
      if (Object.hasOwn(lengths, name)) {
        property = lengths[name as keyof typeof lengths]
        value = suffix
      } else if (name === "gapangle") {
        const angle = suffix.match(/^(\d+(?:\.\d*)?|\.\d+)(?:deg)?$/i)
        if (!angle) throw new Error("Gap angle requires a number in degrees")
        property = "gapAngle"
        value = Number(angle[1])
      } else throw new Error(`Unknown split washer token "${token}"`)
    }
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate split washer property "${property}"`)
    props[property] = value
  }
  return splitWasherModelDefinitionSchema.parse(props)
}
