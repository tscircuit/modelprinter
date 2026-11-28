import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { footCupModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  h: "height",
  height: "height",
  floort: "floorThickness",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
} as const

export function parseFootCupModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "footcup" || tokens[0]?.toLowerCase() !== "footcup") {
    throw new Error("Expected footcup without an inline value")
  }
  const props: Record<string, unknown> = { fn: "footcup" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for footcup`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
    if (tokenName === "mounts") {
      property = "mounts"
      parsed = parseGearInteger(tokenArg, "mounts")
    } else if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    } else {
      throw new Error(`Unknown footcup token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate footcup property "${property}"`)
    }
    props[property] = parsed
  }
  return footCupModelDefinitionSchema.parse(props)
}
