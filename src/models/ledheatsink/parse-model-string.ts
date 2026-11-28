import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ledHeatsinkModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  h: "height",
  height: "height",
  base: "baseThickness",
  seatod: "seatOuterDiameter",
  fint: "finThickness",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
} as const

export function parseLedHeatsinkModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "ledheatsink" || tokens[0]?.toLowerCase() !== "ledheatsink") {
    throw new Error("Expected ledheatsink without an inline value")
  }
  const props: Record<string, unknown> = { fn: "ledheatsink" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for ledheatsink`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
    if (tokenName === "fins") {
      property = "fins"
      parsed = parseGearInteger(tokenArg, "fins")
    } else if (tokenName === "holes") {
      property = "holes"
      parsed = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    } else {
      throw new Error(`Unknown ledheatsink token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate ledheatsink property "${property}"`)
    }
    props[property] = parsed
  }
  return ledHeatsinkModelDefinitionSchema.parse(props)
}
