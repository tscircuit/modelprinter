import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { corrugatedSheetModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  w: "width",
  t: "thickness",
  pitch: "pitch",
  peaktopeak: "peakToPeak",
} as const

export function parseCorrugatedSheetModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "corrugatedsheet" ||
    tokens[0]?.toLowerCase() !== "corrugatedsheet"
  ) {
    throw new Error("Expected corrugatedsheet without an inline value")
  }
  const props: Record<string, unknown> = { fn: "corrugatedsheet" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for corrugatedsheet`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "sinewave") {
      if (Object.hasOwn(props, "sineWave")) {
        throw new Error("Duplicate corrugatedsheet sinewave flag")
      }
      props.sineWave = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "phase") {
      if (!tokenArg) throw new Error(`Missing phase angle in "${token}"`)
      if (Object.hasOwn(props, "phaseAngle")) {
        throw new Error("Duplicate corrugatedsheet phase")
      }
      props.phaseAngle = parseGearAngle(tokenArg, "phase")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate corrugatedsheet property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown corrugatedsheet token "${token}"`)
    }
  }
  return corrugatedSheetModelDefinitionSchema.parse(props)
}
