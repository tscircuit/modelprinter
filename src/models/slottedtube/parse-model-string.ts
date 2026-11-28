import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { slottedTubeModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  wall: "wallThickness",
  l: "length",
  length: "length",
  slotw: "slotWidth",
  slotl: "slotLength",
  axialpitch: "axialPitch",
  end: "endMargin",
} as const

export function parseSlottedTubeModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "slottedtube" || tokens[0]?.toLowerCase() !== "slottedtube") {
    throw new Error("Expected slottedtube without an inline value")
  }
  const props: Record<string, unknown> = { fn: "slottedtube" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for slottedtube`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
    if (tokenName === "rows") {
      property = "rows"
      parsed = parseGearInteger(tokenArg, "rows")
    } else if (tokenName === "around") {
      property = "around"
      parsed = parseGearInteger(tokenArg, "around")
    } else if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    } else {
      throw new Error(`Unknown slottedtube token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate slottedtube property "${property}"`)
    }
    props[property] = parsed
  }
  return slottedTubeModelDefinitionSchema.parse(props)
}
