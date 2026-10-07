import { beltIdlerModelDefinitionSchema } from "./schema"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
const lengths: Record<string, string> = {
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  bore: "boreDiameter",
  borediameter: "boreDiameter",
  beltw: "beltWidth",
  beltwidth: "beltWidth",
  beltt: "beltThickness",
  beltthickness: "beltThickness",
  clearance: "sideClearance",
  sideclearance: "sideClearance",
  flangeh: "flangeHeight",
  flangeheight: "flangeHeight",
  flanget: "flangeThickness",
  flangethickness: "flangeThickness",
}
const counts: Record<string, string> = {}
const selectors: Record<string, string> = { shape: "shape" }
export function parseBeltIdlerModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "beltidler" || !/^beltidler$/i.test(tokens[0]!))
    throw new Error("Expected beltidler without an inline value")
  const props: Record<string, unknown> = { fn: "beltidler" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase(),
      value = match?.[2]
    if (!name || !value) throw new Error(`Invalid beltidler token "${token}"`)
    let property: string,
      parsed: unknown = value
    if (Object.hasOwn(lengths, name)) property = lengths[name]!
    else if (Object.hasOwn(counts, name)) {
      property = counts[name]!
      if (!/^\d+$/.test(value))
        throw new Error("Tooth count must be a complete integer")
      parsed = Number(value)
    } else if (Object.hasOwn(selectors, name)) {
      property = selectors[name]!
      const selection = value.match(/^\(([a-z][a-z0-9]*)\)$/i)
      if (!selection) throw new Error("Selectors require parentheses")
      parsed = selection[1]!.toLowerCase()
    } else throw new Error(`Unknown beltidler token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate beltidler property "${property}"`)
    props[property] = parsed
  }
  return beltIdlerModelDefinitionSchema.parse(props)
}
