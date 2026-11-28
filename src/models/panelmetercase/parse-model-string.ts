import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { panelMeterCaseModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  d: "depth",
  depth: "depth",
  wall: "wallThickness",
  bezel: "bezelThickness",
  cutoutw: "cutoutWidth",
  cutouth: "cutoutHeight",
} as const

export function parsePanelMeterCaseModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "panelmetercase" ||
    tokens[0]?.toLowerCase() !== "panelmetercase"
  ) {
    throw new Error("Expected panelmetercase without an inline value")
  }
  const props: Record<string, unknown> = { fn: "panelmetercase" }
  for (const token of tokens.slice(1)) {
    const cutoutTuple = token.match(/^cutout\(([^,()]+),([^,()]+)\)$/i)
    if (cutoutTuple) {
      const [, rawW = "", rawH = ""] = cutoutTuple
      if (
        Object.hasOwn(props, "cutoutWidth") ||
        Object.hasOwn(props, "cutoutHeight")
      ) {
        throw new Error("Duplicate cutout(...) in panelmetercase string")
      }
      props.cutoutWidth = rawW.trim()
      props.cutoutHeight = rawH.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for panelmetercase`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "sidespring2clips") {
      property = "sideSpring2Clips"
      parsed = true
    } else if (lower === "frontwindow") {
      property = "frontWindow"
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
        throw new Error(`Unknown panelmetercase token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate panelmetercase property "${property}"`)
    }
    props[property] = parsed
  }
  return panelMeterCaseModelDefinitionSchema.parse(props)
}
