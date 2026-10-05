import { expect, test } from "bun:test"
import {
  flexibleHoseModelPropsSchema,
  getFlexibleHoseDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  parseFlexibleHoseModelParams,
} from "../src"

const example =
  "flexiblehose_id6mm_od9mm_l100mm_shape(straight)_wall(smooth)_ends(cut,cut)"

test("flexible hose roadmap example, registry and model union", () => {
  const builder = mp.string(example)
  expect(builder.params()).toMatchObject({
    fn: "flexiblehose",
    id: "6mm",
    ends: "(cut,cut)",
  })
  const model = builder.json()
  expect(model).toEqual({
    fn: "flexiblehose",
    innerDiameter: 6,
    outerDiameter: 9,
    length: 100,
    shape: "straight",
    wall: "smooth",
    ends: ["cut", "cut"],
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("flexiblehose")
  expect(
    getFlexibleHoseDimensions({
      innerDiameter: 6,
      outerDiameter: 9,
      length: 100,
    }),
  ).toEqual({
    innerRadius: 3,
    outerRadius: 4.5,
    wallThickness: 1.5,
    startZ: 0,
    endZ: 100,
  })
})

test("flexible hose units, aliases and complete defaults", () => {
  expect(
    mp
      .string("FLEXIBLEHOSE_INNERDIAMETER0.6cm_OUTERDIAMETER9mm_LENGTH0.1m")
      .json(),
  ).toEqual(mp.string(example).json())
  expect(
    flexibleHoseModelPropsSchema.parse({
      innerDiameter: "0.25in",
      outerDiameter: "0.5in",
      length: "1in",
    }),
  ).toEqual({
    innerDiameter: 6.35,
    outerDiameter: 12.7,
    length: 25.4,
    shape: "straight",
    wall: "smooth",
    ends: ["cut", "cut"],
  })
})

test("flexible hose rejects invalid geometry and ambiguous strings", () => {
  for (const source of [
    "flexiblehose",
    `${example}_id5mm`,
    `${example}_innerdiameter5mm`,
    `${example}_wall(smooth)`,
    `${example}_mystery2mm`,
    example.replace("id6mm", "id9mm"),
    example.replace("id6mm", "id10mm"),
    example.replace("l100mm", "l0mm"),
    example.replace("l100mm", "l-1mm"),
    example.replace("l100mm", "l1.2.3mm"),
    example.replace("id6mm", "id"),
    example.replace("shape(straight)", "shape(bent)"),
    example.replace("wall(smooth)", "wall(corrugated)"),
    example.replace("ends(cut,cut)", "ends(cut)"),
    example.replace("ends(cut,cut)", "ends(cut,cut,cut)"),
    example.replace("ends(cut,cut)", "ends(cut,flare)"),
    example.replace("ends(cut,cut)", "endstrue"),
    example.replace("flexiblehose_", "flexiblehose2_"),
    `${example}_`,
    example.replace("(straight)", "((straight))"),
  ])
    expect(() => mp.string(source).json()).toThrow()
  expect(() =>
    parseFlexibleHoseModelParams({ fn: "wrong", string: example }),
  ).toThrow()
})

test("flexible hose direct schema preserves positive walls and strict props", () => {
  const props = { innerDiameter: 6, outerDiameter: 9, length: 100 }
  for (const changes of [
    { innerDiameter: 9 },
    { outerDiameter: 5 },
    { innerDiameter: 0 },
    { innerDiameter: Number.MIN_VALUE },
    { length: Infinity },
    { outerDiameter: NaN },
    { length: "1.2.3mm" },
    { shape: "bent" },
    { wall: "corrugated" },
    { ends: ["cut", "flare"] },
    { extra: true },
  ])
    expect(() =>
      flexibleHoseModelPropsSchema.parse({ ...props, ...changes }),
    ).toThrow()
})
