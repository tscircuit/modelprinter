import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { checkerPlateModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  w: "width",
  t: "thickness",
  rise: "rise",
  treadl: "treadLength",
  treadw: "treadWidth",
  pitchx: "pitchX",
  pitchy: "pitchY",
} as const

export function parseCheckerPlateModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "checkerplate" ||
    tokens[0]?.toLowerCase() !== "checkerplate"
  ) {
    throw new Error("Expected checkerplate without an inline value")
  }
  const props: Record<string, unknown> = { fn: "checkerplate" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for checkerplate`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "angle") {
      if (!tokenArg) throw new Error(`Missing angle value in "${token}"`)
      if (Object.hasOwn(props, "treadAngle")) {
        throw new Error("Duplicate checkerplate angle")
      }
      props.treadAngle = parseGearAngle(tokenArg, "angle")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate checkerplate property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown checkerplate token "${token}"`)
    }
  }
  return checkerPlateModelDefinitionSchema.parse(props)
}
