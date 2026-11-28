import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { gearMotorModelDefinitionSchema } from "./schema"

const lengths = {
  bodyod: "bodyOuterDiameter",
  od: "bodyOuterDiameter",
  bodyl: "bodyLength",
  l: "bodyLength",
  shaftd: "shaftDiameter",
  shaftl: "shaftLength",
  offset: "shaftOffset",
  shaftoffset: "shaftOffset",
  pcd: "pitchCircleDiameter",
  boltpcd: "pitchCircleDiameter",
} as const

export function parseGearMotorModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "gearmotor" || tokens[0]?.toLowerCase() !== "gearmotor") {
    throw new Error("Expected gearmotor without an inline value")
  }
  const props: Record<string, unknown> = { fn: "gearmotor" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for gearmotor`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "face4hole") {
      property = "face4Hole"
      parsed = true
    } else if (lower === "offsetspur") {
      property = "offsetSpur"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown gearmotor token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate gearmotor property "${property}"`)
    }
    props[property] = parsed
  }
  return gearMotorModelDefinitionSchema.parse(props)
}
