import { expect, test } from "bun:test"
import { mp, splitGrommetModelPropsSchema } from "../src"
test("splitgrommet unit and token case normalization preserves dimensions", () => {
  expect(
    splitGrommetModelPropsSchema.parse({
      panelHoleDiameter: "2.5cm",
      innerDiameter: "1.2cm",
      outerDiameter: "3.0cm",
      height: "0.9cm",
      grooveWidth: "0.3cm",
      grooveDepth: "0.25cm",
      splitWidth: "0.1cm",
    }),
  ).toEqual({
    panelHoleDiameter: 25,
    innerDiameter: 12,
    outerDiameter: 30,
    height: 9,
    grooveWidth: 3,
    grooveDepth: 2.5,
    splitWidth: 1,
  })
  expect(
    mp
      .string(
        "SPLITGROMMET_PANELHOLE25MM_ID12MM_OD30MM_H9MM_GROOVEW3MM_GROOVED2.5MM_SPLIT1MM",
      )
      .json(),
  ).toEqual(
    mp
      .string(
        "splitgrommet_panelhole25mm_id12mm_od30mm_h9mm_groovew3mm_grooved2.5mm_split1mm",
      )
      .json(),
  )
})
