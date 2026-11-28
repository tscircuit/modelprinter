import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { bellowsCouplerModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  od: "outerDiameter",
  l: "length",
  bellowswall: "bellowsWallThickness",
} as const

export function parseBellowsCouplerModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "bellowscoupler" ||
    tokens[0]?.toLowerCase() !== "bellowscoupler"
  ) {
    throw new Error("Expected bellowscoupler without an inline value")
  }
  const props: Record<string, unknown> = { fn: "bellowscoupler" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for bellowscoupler`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "splitclamp") {
      if (Object.hasOwn(props, "splitClamp")) {
        throw new Error("Duplicate bellowscoupler splitclamp flag")
      }
      props.splitClamp = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "folds") {
      if (!tokenArg) throw new Error(`Missing fold count in "${token}"`)
      if (Object.hasOwn(props, "folds")) {
        throw new Error("Duplicate bellowscoupler folds")
      }
      props.folds = parseGearInteger(tokenArg, "folds")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate bellowscoupler property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown bellowscoupler token "${token}"`)
    }
  }
  return bellowsCouplerModelDefinitionSchema.parse(props)
}
