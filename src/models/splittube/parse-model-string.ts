import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { splitTubeModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  wall: "wallThickness",
  l: "length",
  length: "length",
  gap: "gapWidth",
} as const

export function parseSplitTubeModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "splittube" || tokens[0]?.toLowerCase() !== "splittube") {
    throw new Error("Expected splittube without an inline value")
  }
  const props: Record<string, unknown> = { fn: "splittube" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for splittube`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "chordgap") {
      property = "chordGap"
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
        throw new Error(`Unknown splittube token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate splittube property "${property}"`)
    }
    props[property] = parsed
  }
  return splitTubeModelDefinitionSchema.parse(props)
}
