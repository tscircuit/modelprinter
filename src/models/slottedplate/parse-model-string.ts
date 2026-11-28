import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { slottedPlateModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  w: "width",
  t: "thickness",
  slotl: "slotLength",
  slotw: "slotWidth",
  pitchx: "pitchX",
  pitchy: "pitchY",
  edgex: "edgeX",
  edgey: "edgeY",
} as const

export function parseSlottedPlateModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "slottedplate" ||
    tokens[0]?.toLowerCase() !== "slottedplate"
  ) {
    throw new Error("Expected slottedplate without an inline value")
  }
  const props: Record<string, unknown> = { fn: "slottedplate" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for slottedplate`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate slottedplate property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown slottedplate token "${token}"`)
    }
  }
  return slottedPlateModelDefinitionSchema.parse(props)
}
