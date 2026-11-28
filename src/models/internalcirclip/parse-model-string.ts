import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { internalCirclipModelDefinitionSchema } from "./schema"

const lengths = {
  bored: "boreDiameter",
  bore: "boreDiameter",
  borediameter: "boreDiameter",
} as const

export function parseInternalCirclipModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "internalcirclip" ||
    tokens[0]?.toLowerCase() !== "internalcirclip"
  ) {
    throw new Error("Expected internalcirclip without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "internalcirclip" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for internalcirclip`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "din472") {
      property = "din472"
      parsed = true
    } else if (lower === "free") {
      property = "free"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length argument in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown internalcirclip token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate internalcirclip property "${property}"`)
    }
    props[property] = parsed
  }
  return internalCirclipModelDefinitionSchema.parse(props)
}
