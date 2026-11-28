import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ventPanelModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  t: "thickness",
  thickness: "thickness",
  p: "louverPitch",
  pitch: "louverPitch",
  slitw: "slitWidth",
  louverdepth: "louverDepth",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hpx: "holePitchX",
  hpy: "holePitchY",
} as const

export function parseVentPanelModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "ventpanel" || tokens[0]?.toLowerCase() !== "ventpanel") {
    throw new Error("Expected ventpanel without an inline value")
  }
  const props: Record<string, unknown> = { fn: "ventpanel" }
  for (const token of tokens.slice(1)) {
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (
        Object.hasOwn(props, "holePitchX") ||
        Object.hasOwn(props, "holePitchY")
      ) {
        throw new Error("Duplicate hp(...) in ventpanel string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for ventpanel`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
    if (tokenName === "louvers" || tokenName === "holes") {
      property = tokenName
      parsed = parseGearInteger(tokenArg, tokenName)
    } else if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    } else {
      throw new Error(`Unknown ventpanel token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate ventpanel property "${property}"`)
    }
    props[property] = parsed
  }
  return ventPanelModelDefinitionSchema.parse(props)
}
