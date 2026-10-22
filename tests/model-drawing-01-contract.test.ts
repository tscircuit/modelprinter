import { expect, test } from "bun:test"
import { getRectangularTubeDrawing, mp } from "../src"

test("stock-tube drawing references follow normalized dimensions and preserve model JSON", () => {
  const model = mp.string("rectangulartube_w40mm_h20mm_wall3mm_l80mm")
  const definition = model.json()
  const original = structuredClone(definition)
  const drawing = model.drawing()!
  expect(drawing.namedEdges).toEqual([
    {
      name: "overall_width",
      start: { x: -20, y: 10, z: 0 },
      end: { x: 20, y: 10, z: 0 },
    },
    {
      name: "overall_height",
      start: { x: -20, y: -10, z: 0 },
      end: { x: -20, y: 10, z: 0 },
    },
    {
      name: "overall_length",
      start: { x: 20, y: -10, z: 0 },
      end: { x: 20, y: -10, z: 80 },
    },
    {
      name: "wall_thickness",
      start: { x: 0, y: 7, z: 0 },
      end: { x: 0, y: 10, z: 0 },
    },
  ])
  expect(
    drawing.views.map(({ name, direction }) => ({ name, direction })),
  ).toEqual([
    { name: "end", direction: "z+" },
    { name: "side", direction: "y-" },
  ])
  expect(drawing.views[0]!.dimensions).toEqual([
    {
      edgeRef: "overall_width",
      orientation: "horizontal",
      offset: 10,
      precision: 1,
    },
    {
      edgeRef: "overall_height",
      orientation: "vertical",
      offset: 10,
      precision: 1,
    },
    {
      edgeRef: "wall_thickness",
      orientation: "vertical",
      offset: -8,
      precision: 1,
    },
  ])
  expect(
    getRectangularTubeDrawing({
      width: "4cm",
      height: "2cm",
      wallThickness: "0.3cm",
      length: "8cm",
    }),
  ).toEqual(drawing)
  expect(model.json()).toEqual(original)
  expect(definition).toEqual(original)
  const larger = getRectangularTubeDrawing({
    width: 60,
    height: 30,
    wallThickness: 4,
    length: 120,
    outerRadius: 5,
    innerRadius: 1,
  })
  expect(larger.namedEdges.map((edge) => edge.name)).toEqual(
    drawing.namedEdges.map((edge) => edge.name),
  )
  expect(
    larger.namedEdges.map(({ start, end }) =>
      Math.hypot(end.x - start.x, end.y - start.y, end.z - start.z),
    ),
  ).toEqual([60, 30, 120, 4])
  expect(
    mp
      .string("rectangulartube_w40mm_h20mm_wall3mm_l80mm_outerr4mm_innerr1mm")
      .drawing()!.namedEdges,
  ).toEqual(drawing.namedEdges)
  expect(() =>
    getRectangularTubeDrawing({
      width: 40,
      height: 20,
      wallThickness: 10,
      length: 80,
    }),
  ).toThrow()
  expect(mp.string("ballbearing625zz").drawing()).toBeUndefined()
})
