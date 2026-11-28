import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { conicalSpringModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  endod: "endOuterDiameter",
  wire: "wireDiameter",
  l: "length",
  length: "length",
} as const

export function parseConicalSpringModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "conicalspring" ||
    tokens[0]?.toLowerCase() !== "conicalspring"
  ) {
    throw new Error("Expected conicalspring without an inline value")
  }
  const props: Record<string, unknown> = { fn: "conicalspring" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for conicalspring`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "closedends") {
      property = "closedEnds"
      parsed = true
    } else if (lower === "free") {
      property = "freeState"
      parsed = true
    } else if (lower === "righthand" || lower === "righthanded") {
      property = "handedness"
      parsed = "right"
    } else if (lower === "lefthand" || lower === "lefthanded") {
      property = "handedness"
      parsed = "left"
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "turns") {
        property = "turns"
        parsed = parseGearInteger(tokenArg, "turns")
      } else if (tokenName === "active") {
        property = "activeTurns"
        parsed = parseGearInteger(tokenArg, "active")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown conicalspring token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate conicalspring property "${property}"`)
    }
    props[property] = parsed
  }
  return conicalSpringModelDefinitionSchema.parse(props)
}
