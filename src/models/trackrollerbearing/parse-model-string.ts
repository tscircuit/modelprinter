import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { trackRollerBearingModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  od: "outerDiameter",
  w: "width",
  crownradius: "crownRadius",
} as const

export function parseTrackRollerBearingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "trackrollerbearing" ||
    tokens[0]?.toLowerCase() !== "trackrollerbearing"
  ) {
    throw new Error("Expected trackrollerbearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "trackrollerbearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for trackrollerbearing`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "open" || lower === "shielded" || lower === "sealed") {
      if (Object.hasOwn(props, "closure")) {
        throw new Error("Duplicate trackrollerbearing closure flag")
      }
      props.closure = lower
      continue
    }
    if (lower === "boremount") {
      if (Object.hasOwn(props, "boreMount")) {
        throw new Error("Duplicate trackrollerbearing boremount flag")
      }
      props.boreMount = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "rows") {
      if (!tokenArg) throw new Error(`Missing row count in "${token}"`)
      if (Object.hasOwn(props, "rows")) {
        throw new Error("Duplicate trackrollerbearing rows")
      }
      props.rows = parseGearInteger(tokenArg, "rows")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate trackrollerbearing property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown trackrollerbearing token "${token}"`)
    }
  }
  return trackRollerBearingModelDefinitionSchema.parse(props)
}
