import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { brakedCasterModelDefinitionSchema } from "./schema"

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
} as const

export function parseBrakedCasterModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "brakedcaster" ||
    tokens[0]?.toLowerCase() !== "brakedcaster"
  ) {
    throw new Error("Expected brakedcaster without an inline value")
  }
  const props: Record<string, unknown> = { fn: "brakedcaster" }
  for (const token of tokens.slice(1)) {
    const gridTuple = token.match(/^holegrid\(([^,()]+),([^,()]+)\)$/i)
    if (gridTuple) {
      const [, rawX = "", rawY = ""] = gridTuple
      if (
        Object.hasOwn(props, "holeGridX") ||
        Object.hasOwn(props, "holeGridY")
      ) {
        throw new Error("Duplicate holegrid in brakedcaster string")
      }
      props.holeGridX = rawX.trim()
      props.holeGridY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for brakedcaster`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "plate4hole") {
      property = "plate4Hole"
      parsed = true
    } else if (lower === "totalbrake") {
      property = "totalBrake"
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
        throw new Error(`Unknown brakedcaster token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate brakedcaster property "${property}"`)
    }
    props[property] = parsed
  }
  return brakedCasterModelDefinitionSchema.parse(props)
}
