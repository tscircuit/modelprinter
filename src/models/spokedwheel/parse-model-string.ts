import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { spokedWheelModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  w: "rimWidth",
  bore: "boreDiameter",
  keyw: "keyWidth",
  hubw: "hubWidth",
} as const

export function parseSpokedWheelModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "spokedwheel" || tokens[0]?.toLowerCase() !== "spokedwheel") {
    throw new Error("Expected spokedwheel without an inline value")
  }
  const props: Record<string, unknown> = { fn: "spokedwheel" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for spokedwheel`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "keyway") {
      property = "keyway"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "spokes") {
        property = "spokes"
        parsed = parseGearInteger(tokenArg, "spokes")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown spokedwheel token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate spokedwheel property "${property}"`)
    }
    props[property] = parsed
  }
  return spokedWheelModelDefinitionSchema.parse(props)
}
