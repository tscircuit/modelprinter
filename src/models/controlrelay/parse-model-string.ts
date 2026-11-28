import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { controlRelayModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  pinod: "pinDiameter",
  pind: "pinDiameter",
  pindiameter: "pinDiameter",
  pincircle: "pinCircleDiameter",
  pcd: "pinCircleDiameter",
} as const

export function parseControlRelayModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "controlrelay" ||
    tokens[0]?.toLowerCase() !== "controlrelay"
  ) {
    throw new Error("Expected controlrelay without an inline value")
  }
  const props: Record<string, unknown> = { fn: "controlrelay" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for controlrelay`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "centerkey") {
      property = "centerKey"
      parsed = true
    } else if (lower === "rectangularcase" || lower === "rectangular") {
      property = "rectangularCase"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "pins") {
        if (tokenArg !== "8" && tokenArg !== "11") {
          throw new Error(
            `Control relay supports 8-pin or 11-pin octal/undecal bases, got "${token}"`,
          )
        }
        property = "pins"
        parsed = Number(tokenArg)
      } else {
        throw new Error(`Unknown controlrelay token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate controlrelay property "${property}"`)
    }
    props[property] = parsed
  }
  return controlRelayModelDefinitionSchema.parse(props)
}
