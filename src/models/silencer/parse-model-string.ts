import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { silencerModelDefinitionSchema } from "./schema"

const lengths = {
  npt: "portNominal",
  od: "outerDiameter",
  l: "length",
  hexaf: "hexAcrossFlats",
} as const

export function parseSilencerModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "silencer" || tokens[0]?.toLowerCase() !== "silencer") {
    throw new Error("Expected silencer without an inline value")
  }
  const props: Record<string, unknown> = { fn: "silencer" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for silencer`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "porouscylinder") {
      if (Object.hasOwn(props, "porousCylinder")) {
        throw new Error("Duplicate silencer porouscylinder flag")
      }
      props.porousCylinder = true
      continue
    }
    if (lower === "closedtip") {
      if (Object.hasOwn(props, "closedTip")) {
        throw new Error("Duplicate silencer closedtip flag")
      }
      props.closedTip = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate silencer property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown silencer token "${token}"`)
    }
  }
  return silencerModelDefinitionSchema.parse(props)
}
