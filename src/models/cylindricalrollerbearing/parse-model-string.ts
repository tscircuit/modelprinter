import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cylindricalRollerBearingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  w: "width",
} as const

export function parseCylindricalRollerBearingModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "cylindricalrollerbearing" ||
    tokens[0]?.toLowerCase() !== "cylindricalrollerbearing"
  ) {
    throw new Error("Expected cylindricalrollerbearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "cylindricalrollerbearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for cylindricalrollerbearing`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "nu" || lower === "nj" || lower === "nup") {
      if (Object.hasOwn(props, "layout")) {
        throw new Error("Duplicate cylindricalrollerbearing layout flag")
      }
      props.layout = lower
      continue
    }
    if (lower === "open" || lower === "shielded" || lower === "sealed") {
      if (Object.hasOwn(props, "closure")) {
        throw new Error("Duplicate cylindricalrollerbearing closure flag")
      }
      props.closure = lower
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "rows") {
      if (!tokenArg) throw new Error(`Missing row count in "${token}"`)
      if (Object.hasOwn(props, "rows")) {
        throw new Error("Duplicate cylindricalrollerbearing rows")
      }
      props.rows = parseGearInteger(tokenArg, "rows")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(
          `Duplicate cylindricalrollerbearing property "${property}"`,
        )
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown cylindricalrollerbearing token "${token}"`)
    }
  }
  return cylindricalRollerBearingModelDefinitionSchema.parse(props)
}
