import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { fanShroudModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  d: "depth",
  depth: "depth",
  exitod: "exitOuterDiameter",
  wall: "wallThickness",
  hole: "holeDiameter",
  holed: "holeDiameter",
} as const

export function parseFanShroudModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "fanshroud" || tokens[0]?.toLowerCase() !== "fanshroud") {
    throw new Error("Expected fanshroud without an inline value")
  }
  const props: Record<string, unknown> = { fn: "fanshroud" }
  for (const token of tokens.slice(1)) {
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (Object.hasOwn(props, "holePitchX")) {
        throw new Error("Duplicate hp(...) in fanshroud string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for fanshroud`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "squaretoround") {
      property = "squareToRound"
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
        throw new Error(`Unknown fanshroud token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate fanshroud property "${property}"`)
    }
    props[property] = parsed
  }
  return fanShroudModelDefinitionSchema.parse(props)
}
