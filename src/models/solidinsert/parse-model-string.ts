import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { solidInsertModelDefinitionSchema } from "./schema"

const lengths = {
  externald: "externalDiameter",
  externalthreadpitch: "externalThreadPitch",
  l: "length",
  length: "length",
  slotw: "slotWidth",
  slotdepth: "slotDepth",
} as const

export function parseSolidInsertModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "solidinsert" || tokens[0]?.toLowerCase() !== "solidinsert") {
    throw new Error("Expected solidinsert without an inline value")
  }
  const props: Record<string, unknown> = { fn: "solidinsert" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for solidinsert`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "slotted") {
      property = "slotted"
      parsed = true
    } else if (lower === "through") {
      property = "through"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "internalThread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown solidinsert token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate solidinsert property "${property}"`)
    }
    props[property] = parsed
  }
  return solidInsertModelDefinitionSchema.parse(props)
}
