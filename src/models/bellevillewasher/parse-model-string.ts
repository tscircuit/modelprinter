import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { bellevilleWasherModelDefinitionSchema } from "./schema"
export function parseBellevilleWasherModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "bellevillewasher",
    bellevilleWasherModelDefinitionSchema,
    {
      id: "innerDiameter",
      innerdiameter: "innerDiameter",
      od: "outerDiameter",
      outerdiameter: "outerDiameter",
      t: "thickness",
      thickness: "thickness",
      ch: "coneHeight",
      coneheight: "coneHeight",
    },
  )
}
