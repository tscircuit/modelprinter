import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { coilInsertModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  od: "outerDiameter",
  wire: "wireWidth",
} as const

export function parseCoilInsertModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "coilinsert" || tokens[0]?.toLowerCase() !== "coilinsert") {
    throw new Error("Expected coilinsert without an inline value")
  }
  const props: Record<string, unknown> = { fn: "coilinsert" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for coilinsert`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "diamond") {
      property = "diamond"
      parsed = true
    } else if (lower === "benttang") {
      property = "bentTang"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "turns") {
        if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(tokenArg)) {
          throw new Error(`Invalid coil turns in token "${token}"`)
        }
        property = "turns"
        parsed = Number(tokenArg)
      } else if (tokenName === "sectionangle") {
        property = "sectionAngle"
        parsed = parseGearAngle(tokenArg, "sectionangle")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown coilinsert token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate coilinsert property "${property}"`)
    }
    props[property] = parsed
  }
  return coilInsertModelDefinitionSchema.parse(props)
}
