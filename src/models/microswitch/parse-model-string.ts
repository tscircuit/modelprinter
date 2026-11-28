import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { microswitchModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  d: "depth",
  depth: "depth",
  leverl: "leverLength",
  t: "leverThickness",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
} as const

export function parseMicroswitchModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "microswitch" || tokens[0]?.toLowerCase() !== "microswitch") {
    throw new Error("Expected microswitch without an inline value")
  }
  const props: Record<string, unknown> = { fn: "microswitch" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for microswitch`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "solderlug") {
      property = "solderLug"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "holes") {
        property = "holes"
        parsed = parseGearInteger(tokenArg, "holes")
      } else if (tokenName === "contacts") {
        property = "contacts"
        parsed = parseGearInteger(tokenArg, "contacts")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown microswitch token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate microswitch property "${property}"`)
    }
    props[property] = parsed
  }
  return microswitchModelDefinitionSchema.parse(props)
}
