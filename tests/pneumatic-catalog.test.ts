import { expect, test } from "bun:test"
import { mp } from "../src"

test("round, compact and tie-rod cylinder dimensions are shape-specific", () => {
  expect(
    mp
      .string(
        "aircylinder_round_doubleacting_bore0.75in_od1.125in_l3in_stroke1in_rodd0.25in_rodout0.5in_extension0.5in_port(1/8npt)",
      )
      .json(),
  ).toMatchObject({
    fn: "aircylinder",
    boreDiameter: expect.closeTo(19.05),
    extension: 12.7,
    stroke: 25.4,
  })
  for (const style of ["compact", "tierod"]) {
    expect(
      mp
        .string(
          `aircylinder_${style}_singleacting_bore20mm_l50mm_w32mm_h32mm_stroke25mm_rodd8mm_rodout8mm_port(m5x0.8)`,
        )
        .json(),
    ).toMatchObject({
      bodyStyle: style,
      action: "singleacting",
      extension: 0,
    })
  }
})

test("catalog examples resolve to their renderer-independent props", () => {
  const examples = [
    [
      "airslide_rodless_l220mm_w34mm_h42mm_stroke100mm_carriagel55mm_extension25mm",
      { extension: 25, carriageLength: 55 },
    ],
    [
      "rotaryairactuator_rackandpinion_l85mm_w48mm_h40mm_shaftd12mm_shaftl16mm_travel90deg_angle45deg",
      { travel: 90, angle: 45 },
    ],
    [
      "airgripper_parallel_jaws2_l42mm_w30mm_h28mm_jawtravel4mm_opening6mm",
      { jaws: 2, opening: 6 },
    ],
    [
      "airvalvemanifold_stations4_pitch22mm_l104mm_w38mm_h20mm",
      { stations: 4, stationPitch: 22 },
    ],
    [
      "airflowcontrolvalve_elbow_meterout_tubeod6mm_thread(m5x0.8)",
      { metering: "meterout", tubeOuterDiameter: 6 },
    ],
    [
      "vacuumcup_od30mm_h22mm_bellows2_thread(g1/8)",
      { bellows: 2, thread: "g1/8" },
    ],
    [
      "vacuumgenerator_venturi_inline_l55mm_tubeod6mm",
      { venturi: true, tubeOuterDiameter: 6 },
    ],
  ] as const
  for (const [str, props] of examples)
    expect(mp.string(str).json()).toMatchObject(props)
})

test("motion and station counts must fit the given geometry", () => {
  const invalid = [
    "aircylinder_od40mm_bore25mm_rodd10mm_rodout6mm_extension40mm_stroke35mm_l72mm_port(1/8npt)",
    "airslide_rodless_l100mm_w34mm_h42mm_stroke90mm_carriagel55mm_extension25mm",
    "rotaryairactuator_l85mm_w48mm_h40mm_shaftd12mm_shaftl16mm_travel90deg_angle91deg",
    "airgripper_parallel_jaws2_l42mm_w30mm_h28mm_jawtravel4mm_opening9mm",
    "airvalvemanifold_stations6_pitch22mm_l104mm_w38mm_h20mm",
    "vacuumcup_od30mm_h22mm_bellows2.5_thread(g1/8)",
  ]
  for (const str of invalid) expect(() => mp.string(str).json()).toThrow()
})
