import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pcbHolderModelDefinitionSchema } from "./schema"

const lengths = {
  span: "boardSpan",
  h: "height",
  jaww: "jawWidth",
  groovew: "grooveWidth",
  grooved: "grooveDepth",
  basel: "baseLength",
  basew: "baseWidth",
  hole: "holeDiameter",
  pitchx: "pitchX",
  pitchy: "pitchY",
} as const

export function parsePcbHolderModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "pcbholder" || tokens[0]?.toLowerCase() !== "pcbholder") {
    throw new Error("Expected pcbholder without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pcbholder" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pcbholder`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "mounts") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "mounts")) {
        throw new Error("Duplicate pcbholder mounts")
      }
      props.mounts = parseGearInteger(tokenArg, "mounts")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate pcbholder property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown pcbholder token "${token}"`)
    }
  }
  return pcbHolderModelDefinitionSchema.parse(props)
}
