import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { externalCirclipModelDefinitionSchema } from "./schema"

const lengths = {
  shaftd: "shaftDiameter",
  shaftdiameter: "shaftDiameter",
} as const

export function parseExternalCirclipModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "externalcirclip" ||
    tokens[0]?.toLowerCase() !== "externalcirclip"
  ) {
    throw new Error("Expected externalcirclip without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "externalcirclip" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for externalcirclip`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "din471") {
      property = "din471"
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
        throw new Error(`Unknown externalcirclip token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate externalcirclip property "${property}"`)
    }
    props[property] = parsed
  }
  return externalCirclipModelDefinitionSchema.parse(props)
}
