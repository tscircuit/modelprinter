import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { usbConnectorModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  l: "length",
  length: "length",
  mountp: "mountPitch",
  mountpitch: "mountPitch",
  mountdia: "mountHoleDiameter",
  mountd: "mountHoleDiameter",
  tail: "tailLength",
  taill: "tailLength",
  tails: "tailLength",
} as const

export function parseUsbConnectorModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "usbconnector" ||
    tokens[0]?.toLowerCase() !== "usbconnector"
  ) {
    throw new Error("Expected usbconnector without an inline value")
  }
  const props: Record<string, unknown> = { fn: "usbconnector" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for usbconnector`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "te292304-1" || lower === "te2923041") {
      property = "te292304_1"
      parsed = true
    } else if (lower === "usb2typeb") {
      property = "usb2TypeB"
      parsed = true
    } else if (lower === "throughhole" || lower === "tht") {
      property = "throughHole"
      parsed = true
    } else if (lower === "horizontal") {
      property = "horizontal"
      parsed = true
    } else if (lower === "shield") {
      property = "shield"
      parsed = true
    } else if (lower === "unshielded") {
      property = "shield"
      parsed = false
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "contacts") {
        if (tokenArg !== "4") {
          throw new Error(
            `USB 2.0 Type-B receptacle requires contacts4, got "${token}"`,
          )
        }
        property = "contacts"
        parsed = 4
      } else {
        throw new Error(`Unknown usbconnector token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate usbconnector property "${property}"`)
    }
    props[property] = parsed
  }
  return usbConnectorModelDefinitionSchema.parse(props)
}
