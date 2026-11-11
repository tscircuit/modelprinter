import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cWasherModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  h: "thickness",
  t: "thickness",
  thickness: "thickness",
  gap: "gapWidth",
  gapwidth: "gapWidth",
} as const

const flags = {
  custom: "custom",
  "spec(custom)": "custom",
  parallelcut: "parallelCut",
  "cut(parallel)": "parallelCut",
  radialopening: "radialOpening",
  "opening(radial)": "radialOpening",
} as const

export function parseCWasherModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "cwasher" || name?.toLowerCase() !== "cwasher")
    throw new Error("Expected cwasher without an inline value")

  const props: Record<string, unknown> = { fn: "cwasher" }
  for (const token of tokens) {
    const flag = token.toLowerCase()
    let property: string
    let value: string | true
    if (Object.hasOwn(flags, flag)) {
      property = flags[flag as keyof typeof flags]
      value = true
    } else {
      const [key, length] = parseGearToken(token)
      if (!length || !Object.hasOwn(lengths, key))
        throw new Error(`Unknown or malformed cwasher token "${token}"`)
      property = lengths[key as keyof typeof lengths]
      value = length
    }
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate cwasher property "${property}"`)
    props[property] = value
  }
  return cWasherModelDefinitionSchema.parse(props)
}
