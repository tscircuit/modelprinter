import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { hingedBoxModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  wall: "wallThickness",
  wallt: "wallThickness",
  corner: "cornerRadius",
  cornerr: "cornerRadius",
  lidt: "lidThickness",
  lidthickness: "lidThickness",
  pin: "hingePinDiameter",
  pind: "hingePinDiameter",
} as const

export function parseHingedBoxModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "hingedbox" || tokens[0]?.toLowerCase() !== "hingedbox") {
    throw new Error("Expected hingedbox without an inline value")
  }
  const props: Record<string, unknown> = { fn: "hingedbox" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for hingedbox`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "lefthinge") {
      property = "leftHinge"
      parsed = true
    } else if (lower === "rightlatch") {
      property = "rightLatch"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "knuckles") {
        if (!/^\d+$/.test(tokenArg)) {
          throw new Error(`Invalid knuckles count token "${token}"`)
        }
        property = "knuckles"
        parsed = Number(tokenArg)
      } else {
        throw new Error(`Unknown hingedbox token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate hingedbox property "${property}"`)
    }
    props[property] = parsed
  }
  return hingedBoxModelDefinitionSchema.parse(props)
}
