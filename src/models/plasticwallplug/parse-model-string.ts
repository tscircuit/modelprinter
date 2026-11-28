import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { plasticWallPlugModelDefinitionSchema } from "./schema"

const lengths = {
  d: "outerDiameter",
  od: "outerDiameter",
  l: "length",
  bore: "boreDiameter",
  slotl: "slotLength",
  ribh: "ribHeight",
  ribp: "ribPitch",
  flangeod: "flangeOuterDiameter",
  flangeh: "flangeHeight",
} as const

export function parsePlasticWallPlugModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "plasticwallplug" ||
    tokens[0]?.toLowerCase() !== "plasticwallplug"
  ) {
    throw new Error("Expected plasticwallplug without an inline value")
  }
  const props: Record<string, unknown> = { fn: "plasticwallplug" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for plasticwallplug`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "unset") {
      if (Object.hasOwn(props, "unset")) {
        throw new Error("Duplicate plasticwallplug unset flag")
      }
      props.unset = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "slots") {
      if (!tokenArg) throw new Error(`Missing slot count in "${token}"`)
      if (Object.hasOwn(props, "slots")) {
        throw new Error("Duplicate plasticwallplug slots")
      }
      props.slots = parseGearInteger(tokenArg, "slots")
    } else if (tokenName === "ribs") {
      if (!tokenArg) throw new Error(`Missing rib count in "${token}"`)
      if (Object.hasOwn(props, "ribs")) {
        throw new Error("Duplicate plasticwallplug ribs")
      }
      props.ribs = parseGearInteger(tokenArg, "ribs")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate plasticwallplug property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown plasticwallplug token "${token}"`)
    }
  }
  return plasticWallPlugModelDefinitionSchema.parse(props)
}
