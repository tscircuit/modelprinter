import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { toggleControlModelDefinitionSchema } from "./schema"

const lengths = {
  bodyl: "bodyLength",
  bodyw: "bodyWidth",
  bodyh: "bodyHeight",
  threadpitch: "threadPitch",
  bushingl: "bushingLength",
  bushinglength: "bushingLength",
  leverl: "leverLength",
  leverlength: "leverLength",
} as const

export function parseToggleControlModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "togglecontrol" ||
    tokens[0]?.toLowerCase() !== "togglecontrol"
  ) {
    throw new Error("Expected togglecontrol without an inline value")
  }
  const props: Record<string, unknown> = { fn: "togglecontrol" }
  for (const token of tokens.slice(1)) {
    const bodyTuple = token.match(/^body\(([^,()]+),([^,()]+),([^,()]+)\)$/i)
    if (bodyTuple) {
      const [, rawL = "", rawW = "", rawH = ""] = bodyTuple
      if (
        Object.hasOwn(props, "bodyLength") ||
        Object.hasOwn(props, "bodyWidth") ||
        Object.hasOwn(props, "bodyHeight")
      ) {
        throw new Error("Duplicate body dimensions in togglecontrol string")
      }
      props.bodyLength = rawL.trim()
      props.bodyWidth = rawW.trim()
      props.bodyHeight = rawH.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for togglecontrol`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "solderlug") {
      property = "solderLug"
      parsed = true
    } else if (lower === "verticallever") {
      property = "verticalLever"
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
      } else if (tokenName === "contacts") {
        if (tokenArg !== "2" && tokenArg !== "3" && tokenArg !== "6") {
          throw new Error(`Unsupported contact count token "${token}"`)
        }
        property = "contacts"
        parsed = Number(tokenArg)
      } else {
        throw new Error(`Unknown togglecontrol token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate togglecontrol property "${property}"`)
    }
    props[property] = parsed
  }
  return toggleControlModelDefinitionSchema.parse(props)
}
