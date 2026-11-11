import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { saddleWasherModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  h: "height",
  height: "height",
  radius: "seatRadius",
  seatradius: "seatRadius",
} as const

const flags = {
  custom: "custom",
  "spec(custom)": "custom",
  cylindricalseat: "cylindricalSeat",
  "seat(cylindrical)": "cylindricalSeat",
  flattop: "flatTop",
  "top(flat)": "flatTop",
} as const

export function parseSaddleWasherModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "saddlewasher" || name?.toLowerCase() !== "saddlewasher")
    throw new Error("Expected saddlewasher without an inline value")

  const props: Record<string, unknown> = { fn: "saddlewasher" }
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
        throw new Error(`Unknown or malformed saddlewasher token "${token}"`)
      property = lengths[key as keyof typeof lengths]
      value = length
    }
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate saddlewasher property "${property}"`)
    props[property] = value
  }
  return saddleWasherModelDefinitionSchema.parse(props)
}
