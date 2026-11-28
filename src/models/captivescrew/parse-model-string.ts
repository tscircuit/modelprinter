import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { captiveScrewModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  threadl: "threadLength",
  neckd: "neckDiameter",
  neckl: "neckLength",
  headod: "headOuterDiameter",
  headh: "headHeight",
} as const

export function parseCaptiveScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "captivescrew" ||
    tokens[0]?.toLowerCase() !== "captivescrew"
  ) {
    throw new Error("Expected captivescrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "captivescrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for captivescrew`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "panhead") {
      property = "panHead"
      parsed = true
    } else if (lower === "phillips") {
      property = "phillips"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown captivescrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate captivescrew property "${property}"`)
    }
    props[property] = parsed
  }
  return captiveScrewModelDefinitionSchema.parse(props)
}
