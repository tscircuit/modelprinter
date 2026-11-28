import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { telescopicSlideModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  holed: "holeDiameter",
  hole: "holeDiameter",
  holepitch: "holePitch",
  hp: "holePitch",
} as const

export function parseTelescopicSlideModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "telescopicslide" ||
    tokens[0]?.toLowerCase() !== "telescopicslide"
  ) {
    throw new Error("Expected telescopicslide without an inline value")
  }
  const props: Record<string, unknown> = { fn: "telescopicslide" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for telescopicslide`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "sideholes") {
      property = "sideHoles"
      parsed = true
    } else if (lower === "ballrace") {
      property = "ballRace"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "stages") {
        property = "stages"
        parsed = parseGearInteger(tokenArg, "stages")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown telescopicslide token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate telescopicslide property "${property}"`)
    }
    props[property] = parsed
  }
  return telescopicSlideModelDefinitionSchema.parse(props)
}
