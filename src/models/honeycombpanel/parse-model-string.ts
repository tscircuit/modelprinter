import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { honeycombPanelModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  t: "thickness",
  thickness: "thickness",
  skint: "skinThickness",
  hexaf: "hexAcrossFlats",
  corewall: "coreWallThickness",
} as const

export function parseHoneycombPanelModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "honeycombpanel" ||
    tokens[0]?.toLowerCase() !== "honeycombpanel"
  ) {
    throw new Error("Expected honeycombpanel without an inline value")
  }
  const props: Record<string, unknown> = { fn: "honeycombpanel" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for honeycombpanel`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (!(tokenName in lengths)) {
      throw new Error(`Unknown honeycombpanel token "${token}"`)
    }
    if (!tokenArg) {
      throw new Error(`Missing length value in token "${token}"`)
    }
    const property = lengths[tokenName as keyof typeof lengths]
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate honeycombpanel property "${property}"`)
    }
    props[property] = tokenArg
  }
  return honeycombPanelModelDefinitionSchema.parse(props)
}
