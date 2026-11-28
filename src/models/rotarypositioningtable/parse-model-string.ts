import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { rotaryPositioningTableModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  h: "height",
  bore: "boreDiameter",
  boltpcd: "tableBoltPcd",
  basepcd: "baseBoltPcd",
  holed: "holeDiameter",
  tabled: "tableThreadDiameter",
} as const

export function parseRotaryPositioningTableModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "rotarypositioningtable" ||
    tokens[0]?.toLowerCase() !== "rotarypositioningtable"
  ) {
    throw new Error("Expected rotarypositioningtable without an inline value")
  }
  const props: Record<string, unknown> = { fn: "rotarypositioningtable" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for rotarypositioningtable`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "baseholes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "baseHoles")) {
        throw new Error("Duplicate rotarypositioningtable baseholes")
      }
      props.baseHoles = parseGearInteger(tokenArg, "baseholes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(
          `Duplicate rotarypositioningtable property "${property}"`,
        )
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown rotarypositioningtable token "${token}"`)
    }
  }
  return rotaryPositioningTableModelDefinitionSchema.parse(props)
}
