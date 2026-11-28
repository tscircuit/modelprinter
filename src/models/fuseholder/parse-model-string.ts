import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { fuseHolderModelDefinitionSchema } from "./schema"

const lengths = {
  fused: "fuseDiameter",
  fusediameter: "fuseDiameter",
  fusel: "fuseLength",
  fuselength: "fuseLength",
  panelhole: "panelHoleDiameter",
  panelholed: "panelHoleDiameter",
  threadpitch: "threadPitch",
  bodyl: "bodyLength",
  bodylength: "bodyLength",
  capod: "capOuterDiameter",
  capouterdiameter: "capOuterDiameter",
} as const

export function parseFuseHolderModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "fuseholder" || tokens[0]?.toLowerCase() !== "fuseholder") {
    throw new Error("Expected fuseholder without an inline value")
  }
  const props: Record<string, unknown> = { fn: "fuseholder" }
  for (const token of tokens.slice(1)) {
    const fuseTuple = token.match(/^fuse\(([^,()]+),([^,()]+)\)$/i)
    if (fuseTuple) {
      const [, rawD = "", rawL = ""] = fuseTuple
      if (
        Object.hasOwn(props, "fuseDiameter") ||
        Object.hasOwn(props, "fuseLength")
      ) {
        throw new Error("Duplicate fuse dimensions in fuseholder string")
      }
      props.fuseDiameter = rawD.trim()
      props.fuseLength = rawL.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for fuseholder`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "panelbayonet") {
      property = "panelBayonet"
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
        throw new Error(`Unknown fuseholder token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate fuseholder property "${property}"`)
    }
    props[property] = parsed
  }
  return fuseHolderModelDefinitionSchema.parse(props)
}
