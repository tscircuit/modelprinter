import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { bobbinMountModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  h: "height",
  height: "height",
  studd: "studDiameter",
  studdiameter: "studDiameter",
  studl: "studLength",
  studlength: "studLength",
} as const

export function parseBobbinMountModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "bobbinmount" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected bobbinmount without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "bobbinmount" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "studstud") {
      property = "studStud"
      parsed = true
    } else if (/^m\d+(?:\.\d+)?$/i.test(token)) {
      property = "metricSize"
      parsed = `M${token.slice(1)}`
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length argument in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown bobbin mount token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate bobbin mount property "${property}"`)
    }
    props[property] = parsed
  }
  return bobbinMountModelDefinitionSchema.parse(props)
}
