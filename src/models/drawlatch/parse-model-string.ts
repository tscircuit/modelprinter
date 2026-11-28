import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { drawLatchModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  h: "height",
  height: "height",
  t: "sheetThickness",
  thickness: "sheetThickness",
  loopwire: "loopWireDiameter",
  loopwired: "loopWireDiameter",
  catchw: "catchWidth",
  catchwidth: "catchWidth",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hpx: "holePitchX",
  holepitchx: "holePitchX",
  hpy: "holePitchY",
  holepitchy: "holePitchY",
} as const

export function parseDrawLatchModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "drawlatch" || tokens[0]?.toLowerCase() !== "drawlatch") {
    throw new Error("Expected drawlatch without an inline value")
  }
  const props: Record<string, unknown> = { fn: "drawlatch" }
  for (const token of tokens.slice(1)) {
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (
        Object.hasOwn(props, "holePitchX") ||
        Object.hasOwn(props, "holePitchY")
      ) {
        throw new Error("Duplicate hole pitch in drawlatch string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for drawlatch`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "overcenter") {
      property = "overCenter"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown drawlatch token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate drawlatch property "${property}"`)
    }
    props[property] = parsed
  }
  return drawLatchModelDefinitionSchema.parse(props)
}
