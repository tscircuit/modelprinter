import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { linearRailModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  l: "length",
  length: "length",
  p: "pitch",
  pitch: "pitch",
  firsthole: "firstHole",
  hole: "holeDiameter",
  holed: "holeDiameter",
  counterbore: "counterboreDiameter",
  counterboredia: "counterboreDiameter",
  counterboredepth: "counterboreDepth",
} as const

export function parseLinearRailModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "linearrail" || tokens[0]?.toLowerCase() !== "linearrail") {
    throw new Error("Expected linearrail without an inline value")
  }
  const props: Record<string, unknown> = { fn: "linearrail" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for linearrail`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "hgr15") {
      property = "hgr15"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "holes") {
        property = "holes"
        parsed = parseGearInteger(tokenArg, "holes")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown linearrail token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate linearrail property "${property}"`)
    }
    props[property] = parsed
  }
  return linearRailModelDefinitionSchema.parse(props)
}
