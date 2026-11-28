import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { linearBallBushingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  bore: "innerDiameter",
  od: "outerDiameter",
  l: "length",
  length: "length",
} as const

export function parseLinearBallBushingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "linearballbushing" ||
    tokens[0]?.toLowerCase() !== "linearballbushing"
  ) {
    throw new Error("Expected linearballbushing without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "linearballbushing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for linearballbushing`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "closedrecirculating") {
      property = "closedRecirculating"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "circlipgrooves") {
        property = "circlipGrooves"
        parsed = parseGearInteger(tokenArg, "circlipgrooves")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length argument in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown linearballbushing token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate linearballbushing property "${property}"`)
    }
    props[property] = parsed
  }
  return linearBallBushingModelDefinitionSchema.parse(props)
}
