import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { headerSocketModelDefinitionSchema } from "./schema"

const lengths = {
  p: "pitch",
  w: "width",
  d: "depth",
  h: "height",
  tail: "tailLength",
  pin: "pinThickness",
} as const

export function parseHeaderSocketModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "headersocket" ||
    tokens[0]?.toLowerCase() !== "headersocket"
  ) {
    throw new Error("Expected headersocket without an inline value")
  }
  const props: Record<string, unknown> = { fn: "headersocket" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for headersocket`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "female") {
      if (Object.hasOwn(props, "female")) {
        throw new Error("Duplicate headersocket female flag")
      }
      props.female = true
      continue
    }
    if (lower === "throughhole") {
      if (Object.hasOwn(props, "throughHole")) {
        throw new Error("Duplicate headersocket throughhole flag")
      }
      props.throughHole = true
      continue
    }
    if (lower === "vertical") {
      if (Object.hasOwn(props, "vertical")) {
        throw new Error("Duplicate headersocket vertical flag")
      }
      props.vertical = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "n") {
      if (!tokenArg) throw new Error(`Missing contact count in "${token}"`)
      if (Object.hasOwn(props, "contacts")) {
        throw new Error("Duplicate headersocket contacts")
      }
      props.contacts = parseGearInteger(tokenArg, "n")
    } else if (tokenName === "rows") {
      if (!tokenArg) throw new Error(`Missing row count in "${token}"`)
      if (Object.hasOwn(props, "rows")) {
        throw new Error("Duplicate headersocket rows")
      }
      props.rows = parseGearInteger(tokenArg, "rows")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate headersocket property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown headersocket token "${token}"`)
    }
  }
  return headerSocketModelDefinitionSchema.parse(props)
}
