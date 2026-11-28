import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pianoHingeModelDefinitionSchema } from "./schema"

const lengths = {
  w: "openWidth",
  width: "openWidth",
  l: "length",
  length: "length",
  t: "leafThickness",
  thickness: "leafThickness",
  pin: "pinDiameter",
  pind: "pinDiameter",
  knucklel: "knuckleLength",
  knucklelength: "knuckleLength",
  hole: "holeDiameter",
  holed: "holeDiameter",
  p: "holePitch",
  pitch: "holePitch",
  endoffset: "endOffset",
  end: "endOffset",
} as const

export function parsePianoHingeModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "pianohinge" || tokens[0]?.toLowerCase() !== "pianohinge") {
    throw new Error("Expected pianohinge without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pianohinge" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pianohinge`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "open180deg" || lower === "open180") {
      property = "openAngle"
      parsed = 180
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "rows") {
        if (tokenArg !== "2") {
          throw new Error(`Expected rows2 for pianohinge, got "${token}"`)
        }
        property = "rows"
        parsed = 2
      } else if (tokenName === "holes") {
        if (!/^\d+$/.test(tokenArg)) {
          throw new Error(`Invalid holes count token "${token}"`)
        }
        property = "holes"
        parsed = Number(tokenArg)
      } else {
        throw new Error(`Unknown pianohinge token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate pianohinge property "${property}"`)
    }
    props[property] = parsed
  }
  return pianoHingeModelDefinitionSchema.parse(props)
}
