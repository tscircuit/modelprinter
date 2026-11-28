import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseWireRopeClipMetricThread } from "./normalize"
import { wireRopeClipModelDefinitionSchema } from "./schema"

const lengths = {
  roped: "ropeDiameter",
  uboltd: "uBoltDiameter",
  legpitch: "legPitch",
  legl: "legLength",
  saddlew: "saddleWidth",
  saddlel: "saddleLength",
  saddleh: "saddleHeight",
  groover: "grooveRadius",
} as const

export function parseWireRopeClipModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "wireropeclip" ||
    tokens[0]?.toLowerCase() !== "wireropeclip"
  ) {
    throw new Error("Expected wireropeclip without an inline value")
  }
  const props: Record<string, unknown> = { fn: "wireropeclip" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for wireropeclip`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "hexnuts") {
      if (Object.hasOwn(props, "hexNuts")) {
        throw new Error("Duplicate wireropeclip hexnuts flag")
      }
      props.hexNuts = true
      continue
    }
    if (lower === "assembled") {
      if (Object.hasOwn(props, "assembled")) {
        throw new Error("Duplicate wireropeclip assembled flag")
      }
      props.assembled = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate wireropeclip thread size")
      }
      props.threadDiameter = parseWireRopeClipMetricThread(tokenArg)
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate wireropeclip property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown wireropeclip token "${token}"`)
    }
  }
  return wireRopeClipModelDefinitionSchema.parse(props)
}
