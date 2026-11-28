import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { dinRailClipModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  t: "thickness",
  thickness: "thickness",
  hole: "holeDiameter",
  holed: "holeDiameter",
} as const

export function parseDinRailClipModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "dinrailclip" || tokens[0]?.toLowerCase() !== "dinrailclip") {
    throw new Error("Expected dinrailclip without an inline value")
  }
  const props: Record<string, unknown> = { fn: "dinrailclip" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for dinrailclip`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "th35x7.5") {
      property = "th35x75"
      parsed = true
    } else if (lower === "springleaf") {
      property = "springLeaf"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "hooks") {
        property = "hooks"
        parsed = parseGearInteger(tokenArg, "hooks")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown dinrailclip token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate dinrailclip property "${property}"`)
    }
    props[property] = parsed
  }
  return dinRailClipModelDefinitionSchema.parse(props)
}
