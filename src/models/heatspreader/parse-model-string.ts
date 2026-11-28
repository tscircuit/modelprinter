import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { heatSpreaderModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  t: "thickness",
  thickness: "thickness",
  hole: "holeDiameter",
  holed: "holeDiameter",
  countersink: "countersinkDiameter",
} as const

export function parseHeatSpreaderModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "heatspreader" ||
    tokens[0]?.toLowerCase() !== "heatspreader"
  ) {
    throw new Error("Expected heatspreader without an inline value")
  }
  const props: Record<string, unknown> = { fn: "heatspreader" }
  for (const token of tokens.slice(1)) {
    const bossTuple = token.match(/^boss\(([^,()]+),([^,()]+),([^,()]+)\)$/i)
    if (bossTuple) {
      const [, rawW = "", rawL = "", rawH = ""] = bossTuple
      if (Object.hasOwn(props, "bossWidth")) {
        throw new Error("Duplicate boss(...) in heatspreader string")
      }
      props.bossWidth = rawW.trim()
      props.bossLength = rawL.trim()
      props.bossHeight = rawH.trim()
      continue
    }
    const hpTuple = token.match(/^hp\(([^,()]+),([^,()]+)\)$/i)
    if (hpTuple) {
      const [, rawX = "", rawY = ""] = hpTuple
      if (Object.hasOwn(props, "holePitchX")) {
        throw new Error("Duplicate hp(...) in heatspreader string")
      }
      props.holePitchX = rawX.trim()
      props.holePitchY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for heatspreader`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
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
      throw new Error(`Unknown heatspreader token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate heatspreader property "${property}"`)
    }
    props[property] = parsed
  }
  return heatSpreaderModelDefinitionSchema.parse(props)
}
