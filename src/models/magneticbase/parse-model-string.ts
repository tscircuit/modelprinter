import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { magneticBaseModelDefinitionSchema } from "./schema"

const lengths = {
  basel: "baseLength",
  basew: "baseWidth",
  baseh: "baseHeight",
  arml: "armLength",
  armd: "armDiameter",
  jointd: "jointDiameter",
  clampbore: "clampBoreDiameter",
} as const

export function parseMagneticBaseModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "magneticbase" ||
    tokens[0]?.toLowerCase() !== "magneticbase"
  ) {
    throw new Error("Expected magneticbase without an inline value")
  }
  const props: Record<string, unknown> = { fn: "magneticbase" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for magneticbase`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate magneticbase property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown magneticbase token "${token}"`)
    }
  }
  return magneticBaseModelDefinitionSchema.parse(props)
}
