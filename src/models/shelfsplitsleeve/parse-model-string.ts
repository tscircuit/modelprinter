import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { shelfSplitSleeveModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  h: "height",
  bottomod: "bottomOuterDiameter",
  topod: "topOuterDiameter",
  ridgeh: "ridgeHeight",
  ridgew: "ridgeWidth",
  ridgez: "ridgeZ",
  tabw: "tabWidth",
  tabh: "tabHeight",
} as const

export function parseShelfSplitSleeveModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "shelfsplitsleeve" ||
    tokens[0]?.toLowerCase() !== "shelfsplitsleeve"
  ) {
    throw new Error("Expected shelfsplitsleeve without an inline value")
  }
  const props: Record<string, unknown> = { fn: "shelfsplitsleeve" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for shelfsplitsleeve`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "seamtabs") {
      if (!tokenArg) throw new Error(`Missing tab count in "${token}"`)
      if (Object.hasOwn(props, "seamTabs")) {
        throw new Error("Duplicate shelfsplitsleeve seamtabs")
      }
      props.seamTabs = parseGearInteger(tokenArg, "seamtabs")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate shelfsplitsleeve property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown shelfsplitsleeve token "${token}"`)
    }
  }
  return shelfSplitSleeveModelDefinitionSchema.parse(props)
}
