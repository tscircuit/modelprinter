import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { panelClipModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  l: "length",
  strip: "stripThickness",
  gap: "panelGap",
  barbl: "barbLength",
  barbh: "barbHeight",
} as const

export function parsePanelClipModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "panelclip" || tokens[0]?.toLowerCase() !== "panelclip") {
    throw new Error("Expected panelclip without an inline value")
  }
  const props: Record<string, unknown> = { fn: "panelclip" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for panelclip`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "uform") {
      if (Object.hasOwn(props, "uForm")) {
        throw new Error("Duplicate panelclip uform flag")
      }
      props.uForm = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "legs") {
      if (!tokenArg) throw new Error(`Missing leg count in "${token}"`)
      if (Object.hasOwn(props, "legs")) {
        throw new Error("Duplicate panelclip legs")
      }
      props.legs = parseGearInteger(tokenArg, "legs")
    } else if (tokenName === "barbs") {
      if (!tokenArg) throw new Error(`Missing barb count in "${token}"`)
      if (Object.hasOwn(props, "barbs")) {
        throw new Error("Duplicate panelclip barbs")
      }
      props.barbs = parseGearInteger(tokenArg, "barbs")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate panelclip property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown panelclip token "${token}"`)
    }
  }
  return panelClipModelDefinitionSchema.parse(props)
}
