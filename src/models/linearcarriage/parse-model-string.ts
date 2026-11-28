import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { linearCarriageModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  assemblyh: "assemblyHeight",
  holegridx: "holeGridX",
  holegridy: "holeGridY",
  threaddepth: "threadDepth",
} as const

export function parseLinearCarriageModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "linearcarriage" ||
    tokens[0]?.toLowerCase() !== "linearcarriage"
  ) {
    throw new Error("Expected linearcarriage without an inline value")
  }
  const props: Record<string, unknown> = { fn: "linearcarriage" }
  for (const token of tokens.slice(1)) {
    const gridTuple = token.match(/^holegrid\(([^,()]+),([^,()]+)\)$/i)
    if (gridTuple) {
      const [, rawX = "", rawY = ""] = gridTuple
      if (
        Object.hasOwn(props, "holeGridX") ||
        Object.hasOwn(props, "holeGridY")
      ) {
        throw new Error("Duplicate holegrid in linearcarriage string")
      }
      props.holeGridX = rawX.trim()
      props.holeGridY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for linearcarriage`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "hgh15ca") {
      property = "hgh15ca"
      parsed = true
    } else if (lower === "railhgr15") {
      property = "railHgr15"
      parsed = true
    } else if (lower === "tappedholes") {
      property = "tappedHoles"
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
        throw new Error(`Unknown linearcarriage token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate linearcarriage property "${property}"`)
    }
    props[property] = parsed
  }
  return linearCarriageModelDefinitionSchema.parse(props)
}
