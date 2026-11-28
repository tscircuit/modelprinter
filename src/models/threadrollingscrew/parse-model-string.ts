import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { threadRollingScrewModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  headod: "headOuterDiameter",
  headh: "headHeight",
  lobing: "lobingOffset",
  lead: "leadLength",
} as const

export function parseThreadRollingScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "threadrollingscrew" ||
    tokens[0]?.toLowerCase() !== "threadrollingscrew"
  ) {
    throw new Error("Expected threadrollingscrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "threadrollingscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for threadrollingscrew`,
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
    } else if (lower === "trilobular") {
      property = "trilobular"
      parsed = true
    } else if (lower === "tapertip") {
      property = "taperTip"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "lobes") {
        property = "lobes"
        parsed = parseGearInteger(tokenArg, "lobes")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown threadrollingscrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate threadrollingscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return threadRollingScrewModelDefinitionSchema.parse(props)
}
