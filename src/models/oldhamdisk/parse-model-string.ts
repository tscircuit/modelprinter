import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { oldhamDiskModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  w: "width",
  width: "width",
  tonguew: "tongueWidth",
  tongueh: "tongueHeight",
} as const

export function parseOldhamDiskModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "oldhamdisk" || tokens[0]?.toLowerCase() !== "oldhamdisk") {
    throw new Error("Expected oldhamdisk without an inline value")
  }
  const props: Record<string, unknown> = { fn: "oldhamdisk" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for oldhamdisk`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "orthogonaltongues") {
      property = "orthogonalTongues"
      parsed = true
    } else if (lower === "floating") {
      property = "floating"
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
        throw new Error(`Unknown oldhamdisk token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate oldhamdisk property "${property}"`)
    }
    props[property] = parsed
  }
  return oldhamDiskModelDefinitionSchema.parse(props)
}
