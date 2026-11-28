import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { elevatorBoltModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  threadl: "threadLength",
  headod: "headOuterDiameter",
  headh: "headHeight",
  neckw: "neckWidth",
  neckl: "neckLength",
} as const

export function parseElevatorBoltModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "elevatorbolt" ||
    tokens[0]?.toLowerCase() !== "elevatorbolt"
  ) {
    throw new Error("Expected elevatorbolt without an inline value")
  }
  const props: Record<string, unknown> = { fn: "elevatorbolt" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for elevatorbolt`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "flathead") {
      property = "flatHead"
      parsed = true
    } else if (lower === "squareneck") {
      property = "squareNeck"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (!(tokenName in lengths)) {
        throw new Error(`Unknown elevatorbolt token "${token}"`)
      }
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate elevatorbolt property "${property}"`)
    }
    props[property] = parsed
  }
  return elevatorBoltModelDefinitionSchema.parse(props)
}
