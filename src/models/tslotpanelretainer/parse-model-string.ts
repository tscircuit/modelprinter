import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tSlotPanelRetainerModelDefinitionSchema } from "./schema"
const aliases = {
  w: "width",
  h: "height",
  d: "depth",
  t: "thickness",
  panel: "panelThickness",
  offset: "offset",
  hole: "holeDiameter",
  width: "width",
  height: "height",
  depth: "depth",
  thickness: "thickness",
  panelthickness: "panelThickness",
  holediameter: "holeDiameter",
} as const
export function parseTSlotPanelRetainerModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "tslotpanelretainer" ||
    name?.toLowerCase() !== "tslotpanelretainer"
  )
    throw new Error("Expected tslotpanelretainer without inline values")
  const props: Record<string, unknown> = { fn: "tslotpanelretainer" }
  for (const token of tokens) {
    const [key, value] = parseGearToken(token)
    if (!Object.hasOwn(aliases, key) || !value)
      throw new Error(
        `Unknown or malformed tslotpanelretainer token "${token}"`,
      )
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Repeated tslotpanelretainer property "${property}"`)
    props[property] = value
  }
  return tSlotPanelRetainerModelDefinitionSchema.parse(props)
}
