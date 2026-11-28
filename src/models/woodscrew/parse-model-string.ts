import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { woodScrewModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  diameter: "diameter",
  core: "coreDiameter",
  l: "length",
  length: "length",
  threadl: "threadLength",
  threadpitch: "threadPitch",
  headod: "headOuterDiameter",
} as const

export function parseWoodScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "woodscrew" || tokens[0]?.toLowerCase() !== "woodscrew") {
    throw new Error("Expected woodscrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "woodscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for woodscrew`,
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
    } else if (lower === "countersunk") {
      property = "countersunk"
      parsed = true
    } else if (lower === "phillips") {
      property = "phillips"
      parsed = true
    } else if (lower === "conetip") {
      property = "coneTip"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "headangle") {
        property = "headAngle"
        parsed = parseGearAngle(tokenArg, "headangle")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown woodscrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate woodscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return woodScrewModelDefinitionSchema.parse(props)
}
