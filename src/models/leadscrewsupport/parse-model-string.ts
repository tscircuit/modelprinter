import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { leadscrewSupportModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  w: "width",
  h: "height",
  depth: "depth",
  holepitch: "holePitch",
  holed: "holeDiameter",
} as const

export function parseLeadscrewSupportModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "leadscrewsupport" ||
    tokens[0]?.toLowerCase() !== "leadscrewsupport"
  ) {
    throw new Error("Expected leadscrewsupport without an inline value")
  }
  const props: Record<string, unknown> = { fn: "leadscrewsupport" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for leadscrewsupport`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "angularpair") {
      if (Object.hasOwn(props, "angularPair")) {
        throw new Error("Duplicate leadscrewsupport angularpair flag")
      }
      props.angularPair = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate leadscrewsupport property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown leadscrewsupport token "${token}"`)
    }
  }
  return leadscrewSupportModelDefinitionSchema.parse(props)
}
