import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { backupRingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  t: "thickness",
  thickness: "thickness",
  splitgap: "splitGap",
} as const

export function parseBackupRingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "backupring" || tokens[0]?.toLowerCase() !== "backupring") {
    throw new Error("Expected backupring without an inline value")
  }
  const props: Record<string, unknown> = { fn: "backupring" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for backupring`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "rectangular") {
      property = "rectangular"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "splitangle") {
        property = "splitAngleDeg"
        parsed = parseGearAngle(tokenArg, "splitangle")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown backupring token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate backupring property "${property}"`)
    }
    props[property] = parsed
  }
  return backupRingModelDefinitionSchema.parse(props)
}
