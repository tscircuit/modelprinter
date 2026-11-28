import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { wireDuctModelDefinitionSchema } from "./schema"

const lengths = {
  iw: "innerWidth",
  ih: "innerHeight",
  l: "length",
  t: "wallThickness",
  slotw: "slotWidth",
  p: "slotPitch",
  sloth: "slotHeight",
  hole: "holeDiameter",
  hp: "holePitch",
} as const

export function parseWireDuctModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "wireduct" || tokens[0]?.toLowerCase() !== "wireduct") {
    throw new Error("Expected wireduct without an inline value")
  }
  const props: Record<string, unknown> = { fn: "wireduct" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for wireduct`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "slots") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "slots")) {
        throw new Error("Duplicate wireduct slots")
      }
      props.slots = parseGearInteger(tokenArg, "slots")
    } else if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing integer in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate wireduct holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate wireduct property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown wireduct token "${token}"`)
    }
  }
  return wireDuctModelDefinitionSchema.parse(props)
}
