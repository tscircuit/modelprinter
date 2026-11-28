import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { externalToothWasherModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  bodyod: "bodyOuterDiameter",
  bodyouterdiameter: "bodyOuterDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  h: "thickness",
  t: "thickness",
  thickness: "thickness",
  toothw: "toothWidth",
  toothwidth: "toothWidth",
} as const

export function parseExternalToothWasherModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "externaltoothwasher" ||
    tokens[0]?.toLowerCase() !== "externaltoothwasher"
  ) {
    throw new Error("Expected externaltoothwasher without an inline value")
  }
  const props: Record<string, unknown> = { fn: "externaltoothwasher" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for externaltoothwasher`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "teeth") {
        if (!/^\d+$/.test(tokenArg)) {
          throw new Error(`Invalid tooth count token "${token}"`)
        }
        property = "teeth"
        parsed = Number(tokenArg)
      } else if (tokenName === "twist" || tokenName === "twistangle") {
        const angleMatch = tokenArg.match(/^(\d+(?:\.\d*)?|\.\d+)(?:deg)?$/i)
        if (!angleMatch) {
          throw new Error(`Invalid twist angle token "${token}"`)
        }
        property = "twistAngle"
        parsed = Number(angleMatch[1])
      } else {
        throw new Error(`Unknown externaltoothwasher token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate externaltoothwasher property "${property}"`)
    }
    props[property] = parsed
  }
  return externalToothWasherModelDefinitionSchema.parse(props)
}
