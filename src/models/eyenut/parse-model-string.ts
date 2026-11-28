import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { eyeNutModelDefinitionSchema } from "./schema"

const lengths = {
  eyeid: "eyeInnerDiameter",
  eyewire: "eyeWireDiameter",
  baseod: "baseOuterDiameter",
  baseh: "baseHeight",
  threaddepth: "threadDepth",
} as const

export function parseEyeNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "eyenut" || tokens[0]?.toLowerCase() !== "eyenut") {
    throw new Error("Expected eyenut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "eyenut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for eyenut`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "closedeye") {
      property = "closedEye"
      parsed = true
    } else if (lower === "axialplane") {
      property = "axialPlane"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (!(tokenName in lengths)) {
        throw new Error(`Unknown eyenut token "${token}"`)
      }
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate eyenut property "${property}"`)
    }
    props[property] = parsed
  }
  return eyeNutModelDefinitionSchema.parse(props)
}
