import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { jackScrewModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  headaf: "headAcrossFlats",
  headh: "headHeight",
  padod: "padOuterDiameter",
  padh: "padHeight",
  balld: "ballDiameter",
} as const

export function parseJackScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "jackscrew" || tokens[0]?.toLowerCase() !== "jackscrew") {
    throw new Error("Expected jackscrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "jackscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for jackscrew`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "fullthread") {
      property = "fullThread"
      parsed = true
    } else if (lower === "balljoint") {
      property = "ballJoint"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (!(tokenName in lengths)) {
        throw new Error(`Unknown jackscrew token "${token}"`)
      }
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate jackscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return jackScrewModelDefinitionSchema.parse(props)
}
