import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { fanFilterModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  d: "depth",
  depth: "depth",
  framet: "frameThickness",
  grillep: "grillePitch",
  hole: "holeDiameter",
  holed: "holeDiameter",
} as const

export function parseFanFilterModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "fanfilter" || tokens[0]?.toLowerCase() !== "fanfilter") {
    throw new Error("Expected fanfilter without an inline value")
  }
  const props: Record<string, unknown> = { fn: "fanfilter" }
  for (const token of tokens.slice(1)) {
    const mediaTuple = token.match(/^media\(([^,()]+),([^,()]+),([^,()]+)\)$/i)
    if (mediaTuple) {
      const [, rawW = "", rawH = "", rawT = ""] = mediaTuple
      if (Object.hasOwn(props, "mediaWidth")) {
        throw new Error("Duplicate media(...) in fanfilter string")
      }
      props.mediaWidth = rawW.trim()
      props.mediaHeight = rawH.trim()
      props.mediaThickness = rawT.trim()
      continue
    }
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (Object.hasOwn(props, "holePitchX")) {
        throw new Error("Duplicate hp(...) in fanfilter string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for fanfilter`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate fanfilter property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown fanfilter token "${token}"`)
    }
  }
  return fanFilterModelDefinitionSchema.parse(props)
}
