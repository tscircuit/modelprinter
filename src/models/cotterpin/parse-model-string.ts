import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cotterPinModelDefinitionSchema } from "./schema"

const lengths = {
  nominal: "nominalSize",
  nominalsize: "nominalSize",
  d: "nominalSize",
  l: "length",
  length: "length",
} as const

export function parseCotterPinModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "cotterpin" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected cotterpin without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "cotterpin" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "iso1234") {
      property = "iso1234"
      parsed = true
    } else if (lower === "straight") {
      property = "straight"
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
        throw new Error(`Unknown cotter pin token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate cotter pin property "${property}"`)
    }
    props[property] = parsed
  }
  return cotterPinModelDefinitionSchema.parse(props)
}
