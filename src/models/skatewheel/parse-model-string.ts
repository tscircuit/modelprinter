import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { skateWheelModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  w: "width",
  width: "width",
  bore: "boreDiameter",
  bearingseat: "bearingSeatDiameter",
} as const

export function parseSkateWheelModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "skatewheel" || tokens[0]?.toLowerCase() !== "skatewheel") {
    throw new Error("Expected skatewheel without an inline value")
  }
  const props: Record<string, unknown> = { fn: "skatewheel" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for skatewheel`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "bearingbore") {
      property = "bearingBore"
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
        throw new Error(`Unknown skatewheel token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate skatewheel property "${property}"`)
    }
    props[property] = parsed
  }
  return skateWheelModelDefinitionSchema.parse(props)
}
