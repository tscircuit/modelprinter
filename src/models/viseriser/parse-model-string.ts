import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { viseRiserModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  w: "width",
  h: "height",
  wall: "wallThickness",
  corel: "coreLength",
  corew: "coreWidth",
  coreh: "coreHeight",
  topseatw: "topSeatWidth",
  topseatd: "topSeatDepth",
  hole: "holeDiameter",
  pitchx: "pitchX",
  pitchy: "pitchY",
} as const

export function parseViseRiserModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "viseriser" || tokens[0]?.toLowerCase() !== "viseriser") {
    throw new Error("Expected viseriser without an inline value")
  }
  const props: Record<string, unknown> = { fn: "viseriser" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for viseriser`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "mounts") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "mounts")) {
        throw new Error("Duplicate viseriser mounts")
      }
      props.mounts = parseGearInteger(tokenArg, "mounts")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate viseriser property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown viseriser token "${token}"`)
    }
  }
  return viseRiserModelDefinitionSchema.parse(props)
}
