import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { eyeHookModelDefinitionSchema } from "./schema"

const lengths = {
  h: "height",
  height: "height",
  w: "width",
  width: "width",
  body: "bodyDiameter",
  throat: "throatOpening",
  bendr: "bendRadius",
  eyeid: "eyeInnerDiameter",
  eyeod: "eyeOuterDiameter",
} as const

export function parseEyeHookModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "eyehook" || tokens[0]?.toLowerCase() !== "eyehook") {
    throw new Error("Expected eyehook without an inline value")
  }
  const props: Record<string, unknown> = { fn: "eyehook" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for eyehook`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "nolatch") {
      property = "noLatch"
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
        throw new Error(`Unknown eyehook token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate eyehook property "${property}"`)
    }
    props[property] = parsed
  }
  return eyeHookModelDefinitionSchema.parse(props)
}
