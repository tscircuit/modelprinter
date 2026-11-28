import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { quarterTurnFastenerModelDefinitionSchema } from "./schema"

const lengths = {
  d: "shankDiameter",
  l: "length",
  headod: "headOuterDiameter",
  headh: "headHeight",
  slotw: "slotWidth",
  slotdepth: "slotDepth",
  crosspind: "crossPinDiameter",
  crosspinl: "crossPinLength",
  pinoffset: "pinOffset",
} as const

export function parseQuarterTurnFastenerModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "quarterturnfastener" ||
    tokens[0]?.toLowerCase() !== "quarterturnfastener"
  ) {
    throw new Error("Expected quarterturnfastener without an inline value")
  }
  const props: Record<string, unknown> = { fn: "quarterturnfastener" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for quarterturnfastener`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "slotted") {
      if (Object.hasOwn(props, "slotted")) {
        throw new Error("Duplicate quarterturnfastener slotted flag")
      }
      props.slotted = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate quarterturnfastener property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown quarterturnfastener token "${token}"`)
    }
  }
  return quarterTurnFastenerModelDefinitionSchema.parse(props)
}
