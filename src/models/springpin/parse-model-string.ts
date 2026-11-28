import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { springPinModelDefinitionSchema } from "./schema"

const lengths = {
  holed: "holeDiameter",
  hole: "holeDiameter",
  holediameter: "holeDiameter",
  l: "length",
  length: "length",
} as const

export function parseSpringPinModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "springpin" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected springpin without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "springpin" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "iso8752") {
      property = "iso8752"
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
        throw new Error(`Unknown spring pin token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate spring pin property "${property}"`)
    }
    props[property] = parsed
  }
  return springPinModelDefinitionSchema.parse(props)
}
