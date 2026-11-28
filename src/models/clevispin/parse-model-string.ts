import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { clevisPinModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  diameter: "diameter",
  l: "length",
  length: "length",
} as const

export function parseClevisPinModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "clevispin" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected clevispin without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "clevispin" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "iso2341") {
      property = "iso2341"
      parsed = true
    } else if (lower === "formb") {
      property = "formB"
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
        throw new Error(`Unknown clevis pin token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate clevis pin property "${property}"`)
    }
    props[property] = parsed
  }
  return clevisPinModelDefinitionSchema.parse(props)
}
