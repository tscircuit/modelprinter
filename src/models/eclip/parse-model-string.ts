import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { eClipModelDefinitionSchema } from "./schema"

const lengths = {
  shaftd: "shaftDiameter",
  shaftdiameter: "shaftDiameter",
  grooved: "grooveDiameter",
  groovediameter: "grooveDiameter",
} as const

export function parseEClipModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "eclip" || tokens[0]?.toLowerCase() !== "eclip") {
    throw new Error("Expected eclip without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "eclip" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for eclip`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "din6799") {
      property = "din6799"
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
        throw new Error(`Unknown eclip token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate eclip property "${property}"`)
    }
    props[property] = parsed
  }
  return eClipModelDefinitionSchema.parse(props)
}
