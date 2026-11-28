import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { plainWheelModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  w: "width",
  width: "width",
  bore: "boreDiameter",
  bored: "boreDiameter",
  borediameter: "boreDiameter",
  hubod: "hubDiameter",
  hubdiameter: "hubDiameter",
  hubw: "hubWidth",
  hubwidth: "hubWidth",
} as const

export function parsePlainWheelModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "plainwheel" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected plainwheel without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "plainwheel" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "axlebore") {
      property = "axleBore"
      parsed = true
    } else if (lower === "roundedge") {
      property = "roundEdge"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length argument in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown plain wheel token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate plain wheel property "${property}"`)
    }
    props[property] = parsed
  }
  return plainWheelModelDefinitionSchema.parse(props)
}
