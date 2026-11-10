import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { squareHoleWasherModelDefinitionSchema } from "./schema"

const aliases = {
  holew: "holeWidth",
  holewidth: "holeWidth",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  h: "thickness",
  t: "thickness",
  thickness: "thickness",
} as const

export function parseSquareHoleWasherModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "squareholewasher" ||
    name?.toLowerCase() !== "squareholewasher"
  )
    throw new Error("Expected squareholewasher without an inline value")

  const props: Record<string, unknown> = { fn: "squareholewasher" }
  for (const token of tokens) {
    const [key, value] = parseGearToken(token)
    if (!value || !Object.hasOwn(aliases, key))
      throw new Error(`Unknown or malformed squareholewasher token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Repeated squareholewasher property "${property}"`)
    props[property] = value
  }
  return squareHoleWasherModelDefinitionSchema.parse(props)
}
