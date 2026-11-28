import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { terminalBarrierModelDefinitionSchema } from "./schema"

const lengths = {
  p: "pitch",
  pitch: "pitch",
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  barriert: "barrierThickness",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
} as const

export function parseTerminalBarrierModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "terminalbarrier" ||
    tokens[0]?.toLowerCase() !== "terminalbarrier"
  ) {
    throw new Error("Expected terminalbarrier without an inline value")
  }
  const props: Record<string, unknown> = { fn: "terminalbarrier" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for terminalbarrier`,
      )
    }
    const lower = token.toLowerCase()
    const screwMatch = lower.match(/^screw(m\d+(?:\.\d+)?)$/)
    let property: string
    let parsed: unknown
    if (screwMatch) {
      property = "screwThread"
      parsed = screwMatch[1]
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "n" || tokenName === "poles") {
        property = "poles"
        parsed = parseGearInteger(tokenArg, tokenName)
      } else if (tokenName === "holes") {
        property = "holes"
        parsed = parseGearInteger(tokenArg, "holes")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown terminalbarrier token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate terminalbarrier property "${property}"`)
    }
    props[property] = parsed
  }
  return terminalBarrierModelDefinitionSchema.parse(props)
}
