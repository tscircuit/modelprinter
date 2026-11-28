import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { grooveRollerBearingModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  od: "outerDiameter",
  w: "width",
  groover: "grooveRadius",
  groovedepth: "grooveDepth",
} as const

export function parseGrooveRollerBearingModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "grooverollerbearing" ||
    tokens[0]?.toLowerCase() !== "grooverollerbearing"
  ) {
    throw new Error("Expected grooverollerbearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "grooverollerbearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for grooverollerbearing`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "ugroove") {
      if (Object.hasOwn(props, "uGroove")) {
        throw new Error("Duplicate grooverollerbearing ugroove flag")
      }
      props.uGroove = true
      continue
    }
    if (lower === "boremount") {
      if (Object.hasOwn(props, "boreMount")) {
        throw new Error("Duplicate grooverollerbearing boremount flag")
      }
      props.boreMount = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate grooverollerbearing property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown grooverollerbearing token "${token}"`)
    }
  }
  return grooveRollerBearingModelDefinitionSchema.parse(props)
}
