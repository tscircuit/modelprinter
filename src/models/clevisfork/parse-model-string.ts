import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { clevisForkModelDefinitionSchema } from "./schema"

const lengths = {
  threadd: "threadDiameter",
  l: "length",
  gap: "slotGap",
  armw: "armThickness",
  armh: "armHeight",
  arml: "armLength",
  pind: "pinDiameter",
  holeoffset: "holeOffset",
  shankod: "shankOuterDiameter",
  threaddepth: "threadDepth",
} as const

export function parseClevisForkModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "clevisfork" || tokens[0]?.toLowerCase() !== "clevisfork") {
    throw new Error("Expected clevisfork without an inline value")
  }
  const props: Record<string, unknown> = { fn: "clevisfork" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for clevisfork`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate clevisfork property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown clevisfork token "${token}"`)
    }
  }
  return clevisForkModelDefinitionSchema.parse(props)
}
