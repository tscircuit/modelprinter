import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { conveyorRollerModelDefinitionSchema } from "./schema"
const aliases = {
  od: "outerDiameter",
  l: "length",
  wall: "wallThickness",
  shaft: "shaftDiameter",
  ext: "shaftExtension",
  end: "endThickness",
  outerdiameter: "outerDiameter",
  length: "length",
  wallthickness: "wallThickness",
  shaftdiameter: "shaftDiameter",
  shaftextension: "shaftExtension",
  endthickness: "endThickness",
} as const
export function parseConveyorRollerModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "conveyorroller",
    conveyorRollerModelDefinitionSchema,
    aliases,
  )
}
