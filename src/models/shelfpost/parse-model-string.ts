import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { shelfPostModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  wall: "wallThickness",
  l: "length",
  length: "length",
  groovepitch: "groovePitch",
  groovew: "grooveWidth",
  grooved: "grooveDepth",
  firstgroove: "firstGrooveZ",
} as const

export function parseShelfPostModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "shelfpost" || tokens[0]?.toLowerCase() !== "shelfpost") {
    throw new Error("Expected shelfpost without an inline value")
  }
  const props: Record<string, unknown> = { fn: "shelfpost" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for shelfpost`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate shelfpost property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown shelfpost token "${token}"`)
    }
  }
  return shelfPostModelDefinitionSchema.parse(props)
}
