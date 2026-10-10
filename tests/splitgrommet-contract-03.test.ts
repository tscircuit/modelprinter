import { expect, test } from "bun:test"
import { mp, splitGrommetModelPropsSchema } from "../src"
test("splitgrommet rejects ambiguous and physically incompatible inputs", () => {
  const props = {
    panelHoleDiameter: 25,
    innerDiameter: 12,
    outerDiameter: 30,
    height: 9,
    grooveWidth: 3,
    grooveDepth: 2.5,
    splitWidth: 1,
  } as const
  for (const source of [
    "splitgrommet_panelhole25mm_id12mm_od30mm_h9mm_groovew3mm_grooved2.5mm_split1mm_unknown1mm",
    "splitgrommet_panelhole25mm_id12mm_od30mm_h9mm_groovew3mm_grooved2.5mm_split1mm_split2mm",
    "splitgrommet",
  ])
    expect(() => mp.string(source).json()).toThrow()
  expect(() =>
    splitGrommetModelPropsSchema.parse({ ...props, ...{ grooveDepth: 2 } }),
  ).toThrow()
  expect(() =>
    splitGrommetModelPropsSchema.parse({
      ...props,
      panelHoleDiameter: Infinity,
    }),
  ).toThrow()
  expect(() =>
    splitGrommetModelPropsSchema.parse({
      ...props,
      panelHoleDiameter: "12mmjunk",
    }),
  ).toThrow()
})
