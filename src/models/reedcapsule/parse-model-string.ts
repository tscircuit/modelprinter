import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { reedCapsuleModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  l: "bodyLength",
  length: "bodyLength",
  leadod: "leadOuterDiameter",
  leadl: "leadLength",
} as const

export function parseReedCapsuleModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "reedcapsule" || tokens[0]?.toLowerCase() !== "reedcapsule") {
    throw new Error("Expected reedcapsule without an inline value")
  }
  const props: Record<string, unknown> = { fn: "reedcapsule" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for reedcapsule`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "axialglass") {
      property = "axialGlass"
      parsed = true
    } else if (lower === "throughhole") {
      property = "throughHole"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "contacts") {
        property = "contacts"
        parsed = parseGearInteger(tokenArg, "contacts")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown reedcapsule token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate reedcapsule property "${property}"`)
    }
    props[property] = parsed
  }
  return reedCapsuleModelDefinitionSchema.parse(props)
}
