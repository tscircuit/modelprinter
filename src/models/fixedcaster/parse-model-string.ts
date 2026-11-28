import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { fixedCasterModelDefinitionSchema } from "./schema"

const lengths = {
  wheeld: "wheelDiameter",
  wheeldiameter: "wheelDiameter",
  wheelw: "wheelWidth",
  wheelwidth: "wheelWidth",
  platew: "plateWidth",
  platewidth: "plateWidth",
  plateh: "plateHeight",
  plateheight: "plateHeight",
  hole: "holeDiameter",
  holed: "holeDiameter",
  holediameter: "holeDiameter",
} as const

export function parseFixedCasterModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "fixedcaster" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected fixedcaster without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "fixedcaster" }
  for (const token of tokens.slice(1)) {
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
          throw new Error(`Missing length argument in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "holegrid") {
        const tupleMatch = tokenArg.match(/^\(([^(),]+),([^(),]+)\)$/)
        if (!tupleMatch) {
          throw new Error("holegrid requires two parenthesized lengths")
        }
        const [, gx = "", gy = ""] = tupleMatch
        property = "holeGrid"
        parsed = [gx.trim(), gy.trim()]
      } else {
        throw new Error(`Unknown fixed caster token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate fixed caster property "${property}"`)
    }
    props[property] = parsed
  }
  return fixedCasterModelDefinitionSchema.parse(props)
}
