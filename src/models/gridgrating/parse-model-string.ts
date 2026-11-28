import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { gridGratingModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  w: "width",
  h: "bearingBarHeight",
  bart: "bearingBarThickness",
  pitch: "bearingBarPitch",
  crosst: "crossBarThickness",
  crossh: "crossBarHeight",
  crosspitch: "crossBarPitch",
} as const

export function parseGridGratingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "gridgrating" || tokens[0]?.toLowerCase() !== "gridgrating") {
    throw new Error("Expected gridgrating without an inline value")
  }
  const props: Record<string, unknown> = { fn: "gridgrating" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for gridgrating`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate gridgrating property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown gridgrating token "${token}"`)
    }
  }
  return gridGratingModelDefinitionSchema.parse(props)
}
