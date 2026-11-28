import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { yokeFollowerModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  od: "outerDiameter",
  w: "width",
} as const

export function parseYokeFollowerModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "yokefollower" ||
    tokens[0]?.toLowerCase() !== "yokefollower"
  ) {
    throw new Error("Expected yokefollower without an inline value")
  }
  const props: Record<string, unknown> = { fn: "yokefollower" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for yokefollower`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "needle") {
      if (Object.hasOwn(props, "needleBearing")) {
        throw new Error("Duplicate yokefollower needle flag")
      }
      props.needleBearing = true
      continue
    }
    if (lower === "boremount") {
      if (Object.hasOwn(props, "boreMount")) {
        throw new Error("Duplicate yokefollower boremount flag")
      }
      props.boreMount = true
      continue
    }
    if (lower === "open" || lower === "shielded" || lower === "sealed") {
      if (Object.hasOwn(props, "closure")) {
        throw new Error("Duplicate yokefollower closure flag")
      }
      props.closure = lower
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "rows") {
      if (!tokenArg) throw new Error(`Missing row count in "${token}"`)
      if (Object.hasOwn(props, "rows")) {
        throw new Error("Duplicate yokefollower rows")
      }
      props.rows = parseGearInteger(tokenArg, "rows")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate yokefollower property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown yokefollower token "${token}"`)
    }
  }
  return yokeFollowerModelDefinitionSchema.parse(props)
}
