import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { waveSpringWasherModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  strip: "stripThickness",
  freeh: "freeHeight",
} as const

export function parseWaveSpringWasherModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "wavespringwasher" ||
    tokens[0]?.toLowerCase() !== "wavespringwasher"
  ) {
    throw new Error("Expected wavespringwasher without an inline value")
  }
  const props: Record<string, unknown> = { fn: "wavespringwasher" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for wavespringwasher`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "sinusoidal") {
      if (Object.hasOwn(props, "sinusoidal")) {
        throw new Error("Duplicate wavespringwasher sinusoidal flag")
      }
      props.sinusoidal = true
      continue
    }
    if (lower === "freestate") {
      if (Object.hasOwn(props, "freeState")) {
        throw new Error("Duplicate wavespringwasher freestate flag")
      }
      props.freeState = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "waves") {
      if (!tokenArg) throw new Error(`Missing wave count in "${token}"`)
      if (Object.hasOwn(props, "waves")) {
        throw new Error("Duplicate wavespringwasher waves")
      }
      props.waves = parseGearInteger(tokenArg, "waves")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate wavespringwasher property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown wavespringwasher token "${token}"`)
    }
  }
  return waveSpringWasherModelDefinitionSchema.parse(props)
}
