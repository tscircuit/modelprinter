import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { gearRackModelDefinitionSchema } from "./schema"

const lengths = {
  module: "module",
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  hole: "holeDiameter",
  holed: "holeDiameter",
  holediameter: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
} as const

export function parseGearRackModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "gearrack" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected gearrack without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "gearrack" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "base2hole") {
      property = "base2Hole"
      parsed = true
    } else if (
      /^(?:pa|pressureangle)([+-]?\d+(?:\.\d+)?)(?:deg)?$/i.test(token)
    ) {
      const match = token.match(
        /^(?:pa|pressureangle)([+-]?\d+(?:\.\d+)?)(?:deg)?$/i,
      )
      property = "pressureAngle"
      parsed = Number(match?.[1] ?? NaN)
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length argument in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown gear rack token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate gear rack property "${property}"`)
    }
    props[property] = parsed
  }
  return gearRackModelDefinitionSchema.parse(props)
}
