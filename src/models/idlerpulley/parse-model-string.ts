import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { idlerPulleyModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  bore: "boreDiameter",
  bored: "boreDiameter",
  borediameter: "boreDiameter",
  w: "width",
  width: "width",
  flangeod: "flangeDiameter",
  flangediameter: "flangeDiameter",
  bearingbore: "bearingBoreDiameter",
  bearingbored: "bearingBoreDiameter",
  bearingborediameter: "bearingBoreDiameter",
} as const

export function parseIdlerPulleyModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "idlerpulley" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected idlerpulley without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "idlerpulley" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "smoothflanged") {
      property = "smoothFlanged"
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
        throw new Error(`Unknown idler pulley token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate idler pulley property "${property}"`)
    }
    props[property] = parsed
  }
  return idlerPulleyModelDefinitionSchema.parse(props)
}
