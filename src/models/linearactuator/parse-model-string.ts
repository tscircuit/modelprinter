import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { linearActuatorModelDefinitionSchema } from "./schema"

const lengths = {
  bodyod: "bodyOuterDiameter",
  bodyouterdiameter: "bodyOuterDiameter",
  l: "retractedLength",
  length: "retractedLength",
  retractedlength: "retractedLength",
  stroke: "stroke",
  rodod: "rodOuterDiameter",
  rodouterdiameter: "rodOuterDiameter",
  eyebore: "eyeBoreDiameter",
  eyebored: "eyeBoreDiameter",
  eyeborediameter: "eyeBoreDiameter",
} as const

export function parseLinearActuatorModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "linearactuator" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected linearactuator without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "linearactuator" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "eyeeye") {
      property = "eyeEye"
      parsed = true
    } else if (lower === "electricscrew") {
      property = "electricScrew"
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
        throw new Error(`Unknown linear actuator token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate linear actuator property "${property}"`)
    }
    props[property] = parsed
  }
  return linearActuatorModelDefinitionSchema.parse(props)
}
