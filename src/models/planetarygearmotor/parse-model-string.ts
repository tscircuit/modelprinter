import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { planetaryGearmotorModelDefinitionSchema } from "./schema"

const lengths = {
  motorod: "motorOuterDiameter",
  od: "motorOuterDiameter",
  l: "length",
  length: "length",
  shaftd: "shaftDiameter",
  pcd: "pcd",
} as const

export function parsePlanetaryGearmotorModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "planetarygearmotor" ||
    tokens[0]?.toLowerCase() !== "planetarygearmotor"
  ) {
    throw new Error("Expected planetarygearmotor without an inline value")
  }
  const props: Record<string, unknown> = { fn: "planetarygearmotor" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for planetarygearmotor`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "face4hole") {
      property = "face4Hole"
      parsed = true
    } else if (lower === "coaxial") {
      property = "coaxial"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "mountThread"
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
        throw new Error(`Unknown planetarygearmotor token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate planetarygearmotor property "${property}"`)
    }
    props[property] = parsed
  }
  return planetaryGearmotorModelDefinitionSchema.parse(props)
}
