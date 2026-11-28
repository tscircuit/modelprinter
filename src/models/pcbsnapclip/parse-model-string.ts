import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { snapClipModelDefinitionSchema } from "./schema"

const lengths = {
  h: "standoffHeight",
  height: "standoffHeight",
  standoffh: "standoffHeight",
  base: "baseOuterDiameter",
  baseod: "baseOuterDiameter",
  stem: "stemDiameter",
  stemd: "stemDiameter",
  board: "boardThickness",
  boardt: "boardThickness",
  barb: "barbOuterDiameter",
  barbod: "barbOuterDiameter",
  screw: "screwDiameter",
  screwd: "screwDiameter",
} as const

export function parseSnapClipModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "pcbsnapclip" || tokens[0]?.toLowerCase() !== "pcbsnapclip") {
    throw new Error("Expected pcbsnapclip without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pcbsnapclip" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pcbsnapclip`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "splitarrow" || lower === "splitarrowlatch") {
      property = "splitArrow"
      parsed = true
    } else if (lower === "screwfoot") {
      property = "screwFoot"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown pcbsnapclip token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate pcbsnapclip property "${property}"`)
    }
    props[property] = parsed
  }
  return snapClipModelDefinitionSchema.parse(props)
}
