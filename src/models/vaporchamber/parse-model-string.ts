import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { vaporChamberModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  h: "height",
  height: "height",
  corner: "cornerRadius",
  tabw: "tabWidth",
  hole: "holeDiameter",
  holed: "holeDiameter",
} as const

export function parseVaporChamberModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "vaporchamber" ||
    tokens[0]?.toLowerCase() !== "vaporchamber"
  ) {
    throw new Error("Expected vaporchamber without an inline value")
  }
  const props: Record<string, unknown> = { fn: "vaporchamber" }
  for (const token of tokens.slice(1)) {
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (Object.hasOwn(props, "holePitchX")) {
        throw new Error("Duplicate hp(...) in vaporchamber string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for vaporchamber`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
    if (tokenName === "tabs") {
      property = "tabs"
      parsed = parseGearInteger(tokenArg, "tabs")
    } else if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    } else {
      throw new Error(`Unknown vaporchamber token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate vaporchamber property "${property}"`)
    }
    props[property] = parsed
  }
  return vaporChamberModelDefinitionSchema.parse(props)
}
