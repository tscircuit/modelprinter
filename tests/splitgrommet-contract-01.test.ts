import { expect, test } from "bun:test"
import {
  mp,
  splitGrommetModelPropsSchema,
  getSplitGrommetDimensions,
} from "../src"
test("splitgrommet complete strings and public dimensions agree", () => {
  const props = {
    panelHoleDiameter: 25,
    innerDiameter: 12,
    outerDiameter: 30,
    height: 9,
    grooveWidth: 3,
    grooveDepth: 2.5,
    splitWidth: 1,
  } as const
  expect(
    mp
      .string(
        "splitgrommet_panelhole25mm_id12mm_od30mm_h9mm_groovew3mm_grooved2.5mm_split1mm",
      )
      .json(),
  ).toEqual({ fn: "splitgrommet", ...props })
  expect(
    mp
      .string(
        "splitgrommet_panelhole25mm_id12mm_od30mm_h9mm_groovew3mm_grooved2.5mm_split1mm",
      )
      .json(),
  ).toEqual({ fn: "splitgrommet", ...props })
  expect(splitGrommetModelPropsSchema.parse(props)).toEqual(props)
  expect(getSplitGrommetDimensions(props).size).toEqual([30, 30, 9])
})
