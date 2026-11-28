import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { hammerDriveAnchorModelDefinitionSchema } from "./schema"

const lengths = {
  d: "outerDiameter",
  od: "outerDiameter",
  l: "length",
  headod: "headOuterDiameter",
  headh: "headHeight",
  pind: "pinDiameter",
  pinexposed: "pinExposed",
  slotl: "slotLength",
} as const

export function parseHammerDriveAnchorModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "hammerdriveanchor" ||
    tokens[0]?.toLowerCase() !== "hammerdriveanchor"
  ) {
    throw new Error("Expected hammerdriveanchor without an inline value")
  }
  const props: Record<string, unknown> = { fn: "hammerdriveanchor" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for hammerdriveanchor`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "unset") {
      if (Object.hasOwn(props, "unset")) {
        throw new Error("Duplicate hammerdriveanchor unset flag")
      }
      props.unset = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "slots") {
      if (!tokenArg) throw new Error(`Missing slot count in "${token}"`)
      if (Object.hasOwn(props, "slots")) {
        throw new Error("Duplicate hammerdriveanchor slots")
      }
      props.slots = parseGearInteger(tokenArg, "slots")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate hammerdriveanchor property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown hammerdriveanchor token "${token}"`)
    }
  }
  return hammerDriveAnchorModelDefinitionSchema.parse(props)
}
