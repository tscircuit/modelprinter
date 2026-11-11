import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ductEndCapModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  depth: "depth",
  wall: "wallThickness",
  wallthickness: "wallThickness",
  skirtid: "skirtInnerDiameter",
  skirtinnerdiameter: "skirtInnerDiameter",
} as const

export function parseDuctEndCapModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "ductendcap" || name?.toLowerCase() !== "ductendcap")
    throw new Error("Expected ductendcap without an inline value")

  const props: Record<string, unknown> = { fn: "ductendcap" }
  for (const token of tokens) {
    const flag = token.toLowerCase()
    let property: string
    let value: string | true
    if (flag === "flat" || flag === "face(flat)") {
      property = "flatFace"
      value = true
    } else {
      const [key, length] = parseGearToken(token)
      if (!length || !Object.hasOwn(lengths, key))
        throw new Error(`Unknown or malformed ductendcap token "${token}"`)
      property = lengths[key as keyof typeof lengths]
      value = length
    }
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate ductendcap property "${property}"`)
    props[property] = value
  }
  return ductEndCapModelDefinitionSchema.parse(props)
}
