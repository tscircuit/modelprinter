import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { swivelCasterModelDefinitionSchema } from "./schema"

const lengths = {
  wheeld: "wheelDiameter",
  wheelw: "wheelWidth",
  platew: "plateWidth",
  plateh: "plateLength",
  platel: "plateLength",
  holegridx: "holeGridX",
  holegridy: "holeGridY",
  holed: "holeDiameter",
  hole: "holeDiameter",
  swiveloffset: "swivelOffset",
  offset: "swivelOffset",
} as const

export function parseSwivelCasterModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "swivelcaster" ||
    tokens[0]?.toLowerCase() !== "swivelcaster"
  ) {
    throw new Error("Expected swivelcaster without an inline value")
  }
  const props: Record<string, unknown> = { fn: "swivelcaster" }
  for (const token of tokens.slice(1)) {
    const gridTuple = token.match(/^holegrid\(([^,()]+),([^,()]+)\)$/i)
    if (gridTuple) {
      const [, rawX = "", rawY = ""] = gridTuple
      if (
        Object.hasOwn(props, "holeGridX") ||
        Object.hasOwn(props, "holeGridY")
      ) {
        throw new Error("Duplicate holegrid in swivelcaster string")
      }
      props.holeGridX = rawX.trim()
      props.holeGridY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for swivelcaster`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "plate4hole") {
      property = "plate4Hole"
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
        throw new Error(`Unknown swivelcaster token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate swivelcaster property "${property}"`)
    }
    props[property] = parsed
  }
  return swivelCasterModelDefinitionSchema.parse(props)
}
