import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { busbarSupportModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  seatw: "seatWidth",
  seatd: "seatDepth",
  flange: "flangeThickness",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
} as const

export function parseBusbarSupportModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "busbarsupport" ||
    tokens[0]?.toLowerCase() !== "busbarsupport"
  ) {
    throw new Error("Expected busbarsupport without an inline value")
  }
  const props: Record<string, unknown> = { fn: "busbarsupport" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for busbarsupport`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "saddle") {
      property = "saddle"
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
        throw new Error(`Unknown busbarsupport token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate busbarsupport property "${property}"`)
    }
    props[property] = parsed
  }
  return busbarSupportModelDefinitionSchema.parse(props)
}
