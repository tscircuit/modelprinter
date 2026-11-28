import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tSlotCrossPlateModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  h: "height",
  armw: "armWidth",
  t: "thickness",
  hole: "holeDiameter",
  holed: "holeDiameter",
  p: "holePitch",
} as const

export function parseTSlotCrossPlateModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "tslotcrossplate" ||
    tokens[0]?.toLowerCase() !== "tslotcrossplate"
  ) {
    throw new Error("Expected tslotcrossplate without an inline value")
  }
  const props: Record<string, unknown> = { fn: "tslotcrossplate" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for tslotcrossplate`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "cross") {
      if (Object.hasOwn(props, "crossShape")) {
        throw new Error("Duplicate tslotcrossplate cross flag")
      }
      props.crossShape = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing hole count in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate tslotcrossplate holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate tslotcrossplate property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown tslotcrossplate token "${token}"`)
    }
  }
  return tSlotCrossPlateModelDefinitionSchema.parse(props)
}
