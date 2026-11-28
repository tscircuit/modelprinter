import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { concreteScrewModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  diameter: "diameter",
  core: "coreDiameter",
  l: "length",
  length: "length",
  threadpitch: "threadPitch",
  lowd: "lowCrestDiameter",
  af: "acrossFlats",
  flangeod: "flangeOuterDiameter",
  headh: "headHeight",
  cutl: "cutLength",
} as const

export function parseConcreteScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "concretescrew" ||
    tokens[0]?.toLowerCase() !== "concretescrew"
  ) {
    throw new Error("Expected concretescrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "concretescrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for concretescrew`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "righthanded") {
      property = "rightHanded"
      parsed = true
    } else if (lower === "lefthanded") {
      property = "rightHanded"
      parsed = false
    } else if (lower === "hilothread") {
      property = "hiLoThread"
      parsed = true
    } else if (lower === "hexflange") {
      property = "hexFlange"
      parsed = true
    } else if (lower === "notchedconetip") {
      property = "notchedConeTip"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "cuts") {
        property = "cuts"
        parsed = parseGearInteger(tokenArg, "cuts")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown concretescrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate concretescrew property "${property}"`)
    }
    props[property] = parsed
  }
  return concreteScrewModelDefinitionSchema.parse(props)
}
