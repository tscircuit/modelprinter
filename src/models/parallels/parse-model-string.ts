import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parallelsModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  h: "height",
  t: "thickness",
  pairgap: "pairGap",
  edger: "edgeRadius",
} as const

export function parseParallelsModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "parallels" || tokens[0]?.toLowerCase() !== "parallels") {
    throw new Error("Expected parallels without an inline value")
  }
  const props: Record<string, unknown> = { fn: "parallels" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for parallels`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate parallels property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown parallels token "${token}"`)
    }
  }
  return parallelsModelDefinitionSchema.parse(props)
}
