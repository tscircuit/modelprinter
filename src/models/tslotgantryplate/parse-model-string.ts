import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tSlotGantryPlateModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  t: "thickness",
  thickness: "thickness",
  wheelspacing: "wheelSpacing",
  hole: "holeDiameter",
  holed: "holeDiameter",
  holediameter: "holeDiameter",
  eccentric: "eccentricDiameter",
  eccentricd: "eccentricDiameter",
  eccentricdiameter: "eccentricDiameter",
} as const

export function parseTSlotGantryPlateModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "tslotgantryplate" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected tslotgantryplate without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "tslotgantryplate" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "vgroovewheels") {
      property = "vGrooveWheels"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length argument in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "axleholes" || tokenName === "axleholecount") {
        property = "axleHoleCount"
        parsed = parseGearInteger(tokenArg, "axleHoleCount")
      } else {
        throw new Error(`Unknown T-slot gantry plate token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate T-slot gantry plate property "${property}"`)
    }
    props[property] = parsed
  }
  return tSlotGantryPlateModelDefinitionSchema.parse(props)
}
