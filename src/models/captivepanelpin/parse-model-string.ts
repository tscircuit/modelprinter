import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { captivePanelPinModelDefinitionSchema } from "./schema"

const lengths = {
  d: "pinDiameter",
  l: "length",
  knobod: "knobOuterDiameter",
  knobh: "knobHeight",
  collarod: "collarOuterDiameter",
  collarh: "collarHeight",
  springod: "springOuterDiameter",
  wire: "wireDiameter",
  stroke: "stroke",
} as const

export function parseCaptivePanelPinModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "captivepanelpin" ||
    tokens[0]?.toLowerCase() !== "captivepanelpin"
  ) {
    throw new Error("Expected captivepanelpin without an inline value")
  }
  const props: Record<string, unknown> = { fn: "captivepanelpin" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for captivepanelpin`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "extended") {
      if (Object.hasOwn(props, "extended")) {
        throw new Error("Duplicate captivepanelpin extended flag")
      }
      props.extended = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate captivepanelpin property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown captivepanelpin token "${token}"`)
    }
  }
  return captivePanelPinModelDefinitionSchema.parse(props)
}
