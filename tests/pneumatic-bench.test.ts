import { expect, test } from "bun:test"
import { mp } from "../src"

test("compact valve preserves its nominal thread and unthreaded cap exhaust", () => {
  const def = mp
    .string(
      "airdirectionalvalve_flow(3/2)_round_solenoid_springreturn_normallyclosed_ventedcap_radialleads_l27.74mm_w22.22mm_h39.6mm_portheight4.78mm_port(#10-32)",
    )
    .json()
  expect(def).toMatchObject({
    fn: "airdirectionalvalve",
    flow: "3/2",
    bodyStyle: "round",
    portThread: "10-32",
    ventedCap: true,
    portHeight: 4.78,
  })
})

test("a five-port valve accepts different exhaust and supply threads", () => {
  expect(
    mp
      .string(
        "airdirectionalvalve_flow(5/3)_solenoid_closedcenter_l60mm_w22mm_h28mm_port(1/8npt)_exhaust(m5x0.8)",
      )
      .json(),
  ).toMatchObject({ center: "closedcenter", exhaustThread: "m5x0.8" })
})

test("pneumatic fitting keeps physical tube OD separate from nominal pipe size", () => {
  expect(
    mp.string("pushfitting_tee_male_tubeod0.25in_thread(1/4NPT)").json(),
  ).toMatchObject({
    shape: "tee",
    threadGender: "male",
    tubeOuterDiameter: 6.35,
    thread: "1/4npt",
  })
})

test("bench air supply and measurement devices parse", () => {
  const strings = [
    "airregulator_axialradial_relieving_l63.87mm_w17.46mm_h17.46mm_port(10-32)",
    "pressuregauge_backmount_od41.28mm_depth26mm_steml17.77mm_range100_psi_port(1/8npt)_innerport(10-32)",
    "diaphragmpump_brusheddc_l84.45mm_w30.5mm_h50.77mm_headl22mm_motorod30mm_hoseid4mm_barbpitch13mm_barbl13mm",
    "airreliefvalve_gauge_l42mm_w38mm_h75mm_knobod28mm_gaugeod40mm_port(1/4ptf)_gaugeport(1/8ptf)",
    "airdrainvalve_wing_l0.92in_wingw1.25in_hexaf0.40625in_thread(1/8npt)",
  ]
  for (const str of strings)
    expect(String(mp.string(str).json().fn)).toBe(str.split("_")[0]!)
})

test("tubing normalizes routed points in millimeters", () => {
  expect(
    mp.string("airtubing_od0.25in_id0.16in_path(0,0,0|20,-5,0|30,0,10)").json(),
  ).toEqual({
    fn: "airtubing",
    outerDiameter: 6.35,
    innerDiameter: 4.064,
    path: [
      [0, 0, 0],
      [20, -5, 0],
      [30, 0, 10],
    ],
  })
})

test("pneumatic models reject ambiguous, out-of-bounds and malformed inputs", () => {
  const invalid = [
    "pushfitting_elbow_straight_tubeod6mm",
    "pushfitting_tubeod6mm_bodyod4mm",
    "pushfitting_tubeod6mmmm",
    "pushfitting_male_tubeod6mm_thread(6mm)",
    "airdirectionalvalve_flow(5/3)_solenoid_l60mm_w22mm_h28mm_port(1/8npt)",
    "airdirectionalvalve_flow(3/2)_ventedcap_l60mm_w22mm_h28mm_port(1/8npt)",
    "pressuregauge_od30mm_depth10mm_steml4mm_range10_reading20_port(m5x0.8)",
    "airtubing_od6mm_id6mm_l20mm",
    "airtubing_od6mm_id4mm_path(0,0,0|0,0,0)",
    "airtubing_od6mm_id4mm_l20mm_path(0,0,0|20,0,0)",
  ]
  for (const str of invalid) expect(() => mp.string(str).json()).toThrow()
})
