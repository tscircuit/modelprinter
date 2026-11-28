import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { vSlotWheelModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  w: "width",
  width: "width",
  bore: "boreDiameter",
  bearingseat: "bearingSeatDiameter",
} as const

export function parseVSlotWheelModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "vslotwheel" || tokens[0]?.toLowerCase() !== "vslotwheel") {
    throw new Error("Expected vslotwheel without an inline value")
  }
  const props: Record<string, unknown> = { fn: "vslotwheel" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for vslotwheel`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "dualbevel") {
      property = "dualBevel"
      parsed = true
    } else if (lower === "axlebore") {
      property = "axleBore"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "includedangle") {
        property = "includedAngleDeg"
        parsed = parseGearAngle(tokenArg, "includedangle")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown vslotwheel token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate vslotwheel property "${property}"`)
    }
    props[property] = parsed
  }
  return vSlotWheelModelDefinitionSchema.parse(props)
}
