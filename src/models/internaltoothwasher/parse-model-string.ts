import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { internalToothWasherModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  rootid: "rootInnerDiameter",
  od: "outerDiameter",
  h: "thickness",
  toothw: "toothWidth",
} as const

export function parseInternalToothWasherModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "internaltoothwasher" ||
    tokens[0]?.toLowerCase() !== "internaltoothwasher"
  ) {
    throw new Error("Expected internaltoothwasher without an inline value")
  }
  const props: Record<string, unknown> = { fn: "internaltoothwasher" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for internaltoothwasher`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "teeth") {
      if (!tokenArg) throw new Error(`Missing tooth count in "${token}"`)
      if (Object.hasOwn(props, "teeth")) {
        throw new Error("Duplicate internaltoothwasher teeth")
      }
      props.teeth = parseGearInteger(tokenArg, "teeth")
    } else if (tokenName === "twist") {
      if (!tokenArg) throw new Error(`Missing twist angle in "${token}"`)
      if (Object.hasOwn(props, "twistAngle")) {
        throw new Error("Duplicate internaltoothwasher twist")
      }
      props.twistAngle = parseGearAngle(tokenArg, "twist")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate internaltoothwasher property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown internaltoothwasher token "${token}"`)
    }
  }
  return internalToothWasherModelDefinitionSchema.parse(props)
}
