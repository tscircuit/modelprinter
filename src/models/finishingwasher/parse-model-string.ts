import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { finishingWasherModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  h: "height",
  height: "height",
  strip: "stripThickness",
  rimw: "rimWidth",
} as const

export function parseFinishingWasherModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "finishingwasher" ||
    tokens[0]?.toLowerCase() !== "finishingwasher"
  ) {
    throw new Error("Expected finishingwasher without an inline value")
  }
  const props: Record<string, unknown> = { fn: "finishingwasher" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for finishingwasher`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "cup") {
      property = "cup"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "seatangle") {
        property = "seatAngleDeg"
        parsed = parseGearAngle(tokenArg, "seatangle")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown finishingwasher token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate finishingwasher property "${property}"`)
    }
    props[property] = parsed
  }
  return finishingWasherModelDefinitionSchema.parse(props)
}
