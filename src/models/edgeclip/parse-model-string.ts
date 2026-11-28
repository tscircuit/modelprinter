import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { edgeClipModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  l: "length",
  strip: "stripThickness",
  gap: "panelGap",
  barbl: "barbLength",
  barbh: "barbHeight",
} as const

export function parseEdgeClipModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "edgeclip" || tokens[0]?.toLowerCase() !== "edgeclip") {
    throw new Error("Expected edgeclip without an inline value")
  }
  const props: Record<string, unknown> = { fn: "edgeclip" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for edgeclip`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "uform") {
      if (Object.hasOwn(props, "uForm")) {
        throw new Error("Duplicate edgeclip uform flag")
      }
      props.uForm = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "barbs") {
      if (!tokenArg) throw new Error(`Missing barb count in "${token}"`)
      if (Object.hasOwn(props, "barbs")) {
        throw new Error("Duplicate edgeclip barbs")
      }
      props.barbs = parseGearInteger(tokenArg, "barbs")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate edgeclip property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown edgeclip token "${token}"`)
    }
  }
  return edgeClipModelDefinitionSchema.parse(props)
}
