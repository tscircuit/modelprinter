import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { lagScrewModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  diameter: "diameter",
  core: "coreDiameter",
  l: "length",
  length: "length",
  threadl: "threadLength",
  threadpitch: "threadPitch",
  af: "acrossFlats",
  headh: "headHeight",
} as const

export function parseLagScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "lagscrew" || tokens[0]?.toLowerCase() !== "lagscrew") {
    throw new Error("Expected lagscrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "lagscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for lagscrew`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "righthanded") {
      property = "rightHanded"
      parsed = true
    } else if (lower === "lefthanded") {
      property = "rightHanded"
      parsed = false
    } else if (lower === "hexhead") {
      property = "hexHead"
      parsed = true
    } else if (lower === "hexdrive") {
      property = "hexDrive"
      parsed = true
    } else if (lower === "conetip") {
      property = "coneTip"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown lagscrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate lagscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return lagScrewModelDefinitionSchema.parse(props)
}
