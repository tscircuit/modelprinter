import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { openLinearBallBushingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  bore: "innerDiameter",
  od: "outerDiameter",
  l: "length",
  length: "length",
} as const

export function parseOpenLinearBallBushingModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "openlinearballbushing" ||
    tokens[0]?.toLowerCase() !== "openlinearballbushing"
  ) {
    throw new Error("Expected openlinearballbushing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "openlinearballbushing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for openlinearballbushing`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "openrecirculating") {
      property = "openRecirculating"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "openingangle") {
        property = "openingAngle"
        parsed = parseGearAngle(tokenArg, "openingangle")
      } else if (tokenName === "circlipgrooves") {
        property = "circlipGrooves"
        parsed = parseGearInteger(tokenArg, "circlipgrooves")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown openlinearballbushing token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate openlinearballbushing property "${property}"`)
    }
    props[property] = parsed
  }
  return openLinearBallBushingModelDefinitionSchema.parse(props)
}
