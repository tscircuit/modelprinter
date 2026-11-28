import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { multiGrommetModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  h: "height",
  height: "height",
  panelhole: "panelHoleDiameter",
  groovew: "grooveWidth",
  id: "boreInnerDiameter",
  borepcd: "borePcd",
} as const

export function parseMultiGrommetModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "multigrommet" ||
    tokens[0]?.toLowerCase() !== "multigrommet"
  ) {
    throw new Error("Expected multigrommet without an inline value")
  }
  const props: Record<string, unknown> = { fn: "multigrommet" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for multigrommet`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
    if (tokenName === "bores") {
      property = "bores"
      parsed = parseGearInteger(tokenArg, "bores")
    } else if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    } else {
      throw new Error(`Unknown multigrommet token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate multigrommet property "${property}"`)
    }
    props[property] = parsed
  }
  return multiGrommetModelDefinitionSchema.parse(props)
}
