import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { supportedShaftModelDefinitionSchema } from "./schema"

const lengths = {
  d: "shaftDiameter",
  l: "length",
  basew: "baseWidth",
  baseh: "baseHeight",
  holepitch: "holePitch",
  holed: "holeDiameter",
  shaftcenterh: "shaftCenterHeight",
} as const

export function parseSupportedShaftModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "supportedshaft" ||
    tokens[0]?.toLowerCase() !== "supportedshaft"
  ) {
    throw new Error("Expected supportedshaft without an inline value")
  }
  const props: Record<string, unknown> = { fn: "supportedshaft" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for supportedshaft`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "baseholes") {
      if (Object.hasOwn(props, "baseHoles")) {
        throw new Error("Duplicate supportedshaft baseholes flag")
      }
      props.baseHoles = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate supportedshaft property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown supportedshaft token "${token}"`)
    }
  }
  return supportedShaftModelDefinitionSchema.parse(props)
}
