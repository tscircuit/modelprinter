import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { busbarCoverModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  iw: "innerWidth",
  ih: "innerHeight",
  t: "thickness",
  thickness: "thickness",
  lip: "lipWidth",
} as const

export function parseBusbarCoverModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "busbarcover" || tokens[0]?.toLowerCase() !== "busbarcover") {
    throw new Error("Expected busbarcover without an inline value")
  }
  const props: Record<string, unknown> = { fn: "busbarcover" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for busbarcover`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "inwarduchannel") {
      property = "inwardUChannel"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown busbarcover token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate busbarcover property "${property}"`)
    }
    props[property] = parsed
  }
  return busbarCoverModelDefinitionSchema.parse(props)
}
