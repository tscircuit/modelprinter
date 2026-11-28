import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { sanitaryClampFerruleModelDefinitionSchema } from "./schema"

const lengths = {
  tubeod: "tubeOuterDiameter",
  tubeid: "tubeInnerDiameter",
  flangeod: "flangeOuterDiameter",
  l: "length",
} as const

export function parseSanitaryClampFerruleModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "sanitaryclampferrule" ||
    tokens[0]?.toLowerCase() !== "sanitaryclampferrule"
  ) {
    throw new Error("Expected sanitaryclampferrule without an inline value")
  }
  const props: Record<string, unknown> = { fn: "sanitaryclampferrule" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for sanitaryclampferrule`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "din32676") {
      if (Object.hasOwn(props, "din32676")) {
        throw new Error("Duplicate sanitaryclampferrule din32676 flag")
      }
      props.din32676 = true
      continue
    }
    if (lower === "seriesc") {
      if (Object.hasOwn(props, "seriesC")) {
        throw new Error("Duplicate sanitaryclampferrule seriesc flag")
      }
      props.seriesC = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate sanitaryclampferrule property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown sanitaryclampferrule token "${token}"`)
    }
  }
  return sanitaryClampFerruleModelDefinitionSchema.parse(props)
}
