import {
  hingeModelPropsSchema as schema0,
  hingeModelDefinitionSchema as definition0,
} from "../../src/models/hinge"
import {
  register as register0,
  model as model0,
} from "../../src/models/hinge/register"
import {
  barrelHingeModelPropsSchema as schema1,
  barrelHingeModelDefinitionSchema as definition1,
} from "../../src/models/barrelhinge"
import {
  register as register1,
  model as model1,
} from "../../src/models/barrelhinge/register"
import {
  drawLatchModelPropsSchema as schema2,
  drawLatchModelDefinitionSchema as definition2,
} from "../../src/models/drawlatch"
import {
  register as register2,
  model as model2,
} from "../../src/models/drawlatch/register"
import {
  toggleClampModelPropsSchema as schema3,
  toggleClampModelDefinitionSchema as definition3,
} from "../../src/models/toggleclamp"
import {
  register as register3,
  model as model3,
} from "../../src/models/toggleclamp/register"
import {
  levelingFootModelPropsSchema as schema4,
  levelingFootModelDefinitionSchema as definition4,
} from "../../src/models/levelingfoot"
import {
  register as register4,
  model as model4,
} from "../../src/models/levelingfoot/register"
import {
  casterModelPropsSchema as schema5,
  casterModelDefinitionSchema as definition5,
} from "../../src/models/caster"
import {
  register as register5,
  model as model5,
} from "../../src/models/caster/register"
import {
  rubberBumperModelPropsSchema as schema6,
  rubberBumperModelDefinitionSchema as definition6,
} from "../../src/models/rubberbumper"
import {
  register as register6,
  model as model6,
} from "../../src/models/rubberbumper/register"
import {
  bridgeHandleModelPropsSchema as schema7,
  bridgeHandleModelDefinitionSchema as definition7,
} from "../../src/models/bridgehandle"
import {
  register as register7,
  model as model7,
} from "../../src/models/bridgehandle/register"
import {
  handwheelModelPropsSchema as schema8,
  handwheelModelDefinitionSchema as definition8,
} from "../../src/models/handwheel"
import {
  register as register8,
  model as model8,
} from "../../src/models/handwheel/register"
import {
  starKnobModelPropsSchema as schema9,
  starKnobModelDefinitionSchema as definition9,
} from "../../src/models/starknob"
import {
  register as register9,
  model as model9,
} from "../../src/models/starknob/register"
import {
  leverHandleModelPropsSchema as schema10,
  leverHandleModelDefinitionSchema as definition10,
} from "../../src/models/leverhandle"
import {
  register as register10,
  model as model10,
} from "../../src/models/leverhandle/register"
import {
  squareKeyModelPropsSchema as schema11,
  squareKeyModelDefinitionSchema as definition11,
} from "../../src/models/squarekey"
import {
  register as register11,
  model as model11,
} from "../../src/models/squarekey/register"
import {
  woodruffKeyModelPropsSchema as schema12,
  woodruffKeyModelDefinitionSchema as definition12,
} from "../../src/models/woodruffkey"
import {
  register as register12,
  model as model12,
} from "../../src/models/woodruffkey/register"
import {
  iBeamModelPropsSchema as schema13,
  iBeamModelDefinitionSchema as definition13,
} from "../../src/models/ibeam"
import {
  register as register13,
  model as model13,
} from "../../src/models/ibeam/register"
import {
  teeBarModelPropsSchema as schema14,
  teeBarModelDefinitionSchema as definition14,
} from "../../src/models/teebar"
import {
  register as register14,
  model as model14,
} from "../../src/models/teebar/register"
import {
  roundBarModelPropsSchema as schema15,
  roundBarModelDefinitionSchema as definition15,
} from "../../src/models/roundbar"
import {
  register as register15,
  model as model15,
} from "../../src/models/roundbar/register"
import {
  splitRingHangerModelPropsSchema as schema16,
  splitRingHangerModelDefinitionSchema as definition16,
} from "../../src/models/splitringhanger"
import {
  register as register16,
  model as model16,
} from "../../src/models/splitringhanger/register"
import {
  detentPinModelPropsSchema as schema17,
  detentPinModelDefinitionSchema as definition17,
} from "../../src/models/detentpin"
import {
  register as register17,
  model as model17,
} from "../../src/models/detentpin/register"
import {
  expandedMetalModelPropsSchema as schema18,
  expandedMetalModelDefinitionSchema as definition18,
} from "../../src/models/expandedmetal"
import {
  register as register18,
  model as model18,
} from "../../src/models/expandedmetal/register"
import {
  coolingFanModelPropsSchema as schema19,
  coolingFanModelDefinitionSchema as definition19,
} from "../../src/models/coolingfan"
import {
  register as register19,
  model as model19,
} from "../../src/models/coolingfan/register"
export const machineHardwareContracts = [
  {
    name: "hinge",
    schema: schema0,
    definition: definition0,
    register: register0,
    parse: model0.parse,
    defaults: {
      width: 60,
      length: 60,
      leafThickness: 3,
      barrelDiameter: 10,
      pinDiameter: 4,
      holeDiameter: 5,
    },
    source:
      "hinge_width60mm_length60mm_leafthickness3mm_barreldiameter10mm_pindiameter4mm_holediameter5mm",
    first: "width",
    invalid: { pinDiameter: 15 },
  },
  {
    name: "barrelhinge",
    schema: schema1,
    definition: definition1,
    register: register1,
    parse: model1.parse,
    defaults: {
      height: 60,
      barrelDiameter: 14,
      pinDiameter: 6,
      leafWidth: 20,
      leafThickness: 4,
      holeDiameter: 5,
    },
    source:
      "barrelhinge_height60mm_barreldiameter14mm_pindiameter6mm_leafwidth20mm_leafthickness4mm_holediameter5mm",
    first: "height",
    invalid: { pinDiameter: 15 },
  },
  {
    name: "drawlatch",
    schema: schema2,
    definition: definition2,
    register: register2,
    parse: model2.parse,
    defaults: {
      length: 100,
      width: 25,
      baseThickness: 4,
      handleHeight: 18,
      wireDiameter: 4,
      holeDiameter: 4,
    },
    source:
      "drawlatch_length100mm_width25mm_basethickness4mm_handleheight18mm_wirediameter4mm_holediameter4mm",
    first: "length",
    invalid: { wireDiameter: 10 },
  },
  {
    name: "toggleclamp",
    schema: schema3,
    definition: definition3,
    register: register3,
    parse: model3.parse,
    defaults: {
      length: 110,
      width: 35,
      baseThickness: 5,
      handleHeight: 55,
      armLength: 75,
      padDiameter: 14,
      holeDiameter: 5,
    },
    source:
      "toggleclamp_length110mm_width35mm_basethickness5mm_handleheight55mm_armlength75mm_paddiameter14mm_holediameter5mm",
    first: "length",
    invalid: { padDiameter: 30 },
  },
  {
    name: "levelingfoot",
    schema: schema4,
    definition: definition4,
    register: register4,
    parse: model4.parse,
    defaults: {
      baseDiameter: 50,
      baseHeight: 12,
      stemDiameter: 12,
      stemLength: 55,
      hexDiameter: 24,
      hexHeight: 8,
    },
    source:
      "levelingfoot_basediameter50mm_baseheight12mm_stemdiameter12mm_stemlength55mm_hexdiameter24mm_hexheight8mm",
    first: "baseDiameter",
    invalid: { stemDiameter: 40 },
  },
  {
    name: "caster",
    schema: schema5,
    definition: definition5,
    register: register5,
    parse: model5.parse,
    defaults: {
      wheelDiameter: 75,
      wheelWidth: 24,
      axleDiameter: 10,
      forkThickness: 5,
      plateWidth: 50,
      plateLength: 65,
      plateThickness: 5,
      overallHeight: 110,
      holeDiameter: 5,
    },
    source:
      "caster_wheeldiameter75mm_wheelwidth24mm_axlediameter10mm_forkthickness5mm_platewidth50mm_platelength65mm_platethickness5mm_overallheight110mm_holediameter5mm",
    first: "wheelDiameter",
    invalid: { overallHeight: 70 },
  },
  {
    name: "rubberbumper",
    schema: schema6,
    definition: definition6,
    register: register6,
    parse: model6.parse,
    defaults: {
      diameter: 30,
      height: 15,
      holeDiameter: 6,
      counterboreDiameter: 13,
      counterboreDepth: 5,
    },
    source:
      "rubberbumper_diameter30mm_height15mm_holediameter6mm_counterborediameter13mm_counterboredepth5mm",
    first: "diameter",
    invalid: { counterboreDepth: 16 },
  },
  {
    name: "bridgehandle",
    schema: schema7,
    definition: definition7,
    register: register7,
    parse: model7.parse,
    defaults: {
      length: 120,
      gripDiameter: 15,
      height: 40,
      mountingDiameter: 24,
      mountingHeight: 5,
      holeDiameter: 5,
    },
    source:
      "bridgehandle_length120mm_gripdiameter15mm_height40mm_mountingdiameter24mm_mountingheight5mm_holediameter5mm",
    first: "length",
    invalid: { height: 10 },
  },
  {
    name: "handwheel",
    schema: schema8,
    definition: definition8,
    register: register8,
    parse: model8.parse,
    defaults: {
      outerDiameter: 100,
      rimWidth: 12,
      hubDiameter: 28,
      hubHeight: 25,
      boreDiameter: 12,
      spokes: 4,
    },
    source:
      "handwheel_outerdiameter100mm_rimwidth12mm_hubdiameter28mm_hubheight25mm_borediameter12mm_spokes4",
    first: "outerDiameter",
    invalid: { boreDiameter: 30 },
  },
  {
    name: "starknob",
    schema: schema9,
    definition: definition9,
    register: register9,
    parse: model9.parse,
    defaults: {
      diameter: 40,
      height: 16,
      boreDiameter: 6,
      lobes: 5,
      hubDiameter: 18,
      hubHeight: 10,
    },
    source:
      "starknob_diameter40mm_height16mm_borediameter6mm_lobes5_hubdiameter18mm_hubheight10mm",
    first: "diameter",
    invalid: { boreDiameter: 20 },
  },
  {
    name: "leverhandle",
    schema: schema10,
    definition: definition10,
    register: register10,
    parse: model10.parse,
    defaults: {
      length: 90,
      width: 18,
      height: 16,
      hubDiameter: 28,
      hubHeight: 25,
      boreDiameter: 8,
    },
    source:
      "leverhandle_length90mm_width18mm_height16mm_hubdiameter28mm_hubheight25mm_borediameter8mm",
    first: "length",
    invalid: { boreDiameter: 25 },
  },
  {
    name: "squarekey",
    schema: schema11,
    definition: definition11,
    register: register11,
    parse: model11.parse,
    defaults: { width: 8, height: 8, length: 40, chamfer: 1 },
    source: "squarekey_width8mm_height8mm_length40mm_chamfer1mm",
    first: "width",
    invalid: { chamfer: 4 },
  },
  {
    name: "woodruffkey",
    schema: schema12,
    definition: definition12,
    register: register12,
    parse: model12.parse,
    defaults: { diameter: 30, thickness: 6, height: 12 },
    source: "woodruffkey_diameter30mm_thickness6mm_height12mm",
    first: "diameter",
    invalid: { height: 20 },
  },
  {
    name: "ibeam",
    schema: schema13,
    definition: definition13,
    register: register13,
    parse: model13.parse,
    defaults: {
      width: 40,
      height: 60,
      webThickness: 4,
      flangeThickness: 6,
      length: 100,
    },
    source:
      "ibeam_width40mm_height60mm_webthickness4mm_flangethickness6mm_length100mm",
    first: "width",
    invalid: { flangeThickness: 40 },
  },
  {
    name: "teebar",
    schema: schema14,
    definition: definition14,
    register: register14,
    parse: model14.parse,
    defaults: {
      width: 40,
      height: 40,
      webThickness: 4,
      flangeThickness: 6,
      length: 100,
    },
    source:
      "teebar_width40mm_height40mm_webthickness4mm_flangethickness6mm_length100mm",
    first: "width",
    invalid: { flangeThickness: 40 },
  },
  {
    name: "roundbar",
    schema: schema15,
    definition: definition15,
    register: register15,
    parse: model15.parse,
    defaults: { diameter: 20, length: 100, chamfer: 1 },
    source: "roundbar_diameter20mm_length100mm_chamfer1mm",
    first: "diameter",
    invalid: { chamfer: 20 },
  },
  {
    name: "splitringhanger",
    schema: schema16,
    definition: definition16,
    register: register16,
    parse: model16.parse,
    defaults: {
      pipeDiameter: 32,
      bandThickness: 3,
      bandWidth: 15,
      gap: 2,
      lugWidth: 14,
      holeDiameter: 5,
    },
    source:
      "splitringhanger_pipediameter32mm_bandthickness3mm_bandwidth15mm_gap2mm_lugwidth14mm_holediameter5mm",
    first: "pipeDiameter",
    invalid: { gap: 5 },
  },
  {
    name: "detentpin",
    schema: schema17,
    definition: definition17,
    register: register17,
    parse: model17.parse,
    defaults: {
      shaftDiameter: 8,
      shaftLength: 50,
      headDiameter: 18,
      headHeight: 6,
      ballDiameter: 3,
      ballOffset: 4,
      ringDiameter: 24,
      ringWire: 2,
    },
    source:
      "detentpin_shaftdiameter8mm_shaftlength50mm_headdiameter18mm_headheight6mm_balldiameter3mm_balloffset4mm_ringdiameter24mm_ringwire2mm",
    first: "shaftDiameter",
    invalid: { ringWire: 8 },
  },
  {
    name: "expandedmetal",
    schema: schema18,
    definition: definition18,
    register: register18,
    parse: model18.parse,
    defaults: {
      width: 100,
      length: 100,
      thickness: 2,
      diamondWidth: 15,
      diamondLength: 30,
      strandWidth: 2,
      frameWidth: 3,
    },
    source:
      "expandedmetal_width100mm_length100mm_thickness2mm_diamondwidth15mm_diamondlength30mm_strandwidth2mm_framewidth3mm",
    first: "width",
    invalid: { diamondWidth: 1 },
  },
  {
    name: "coolingfan",
    schema: schema19,
    definition: definition19,
    register: register19,
    parse: model19.parse,
    defaults: {
      size: 80,
      thickness: 25,
      hubDiameter: 28,
      bladeCount: 7,
      bladeWidth: 12,
      bladeThickness: 3,
      mountingHoleDiameter: 4,
      frameThickness: 6,
    },
    source:
      "coolingfan_size80mm_thickness25mm_hubdiameter28mm_bladecount7_bladewidth12mm_bladethickness3mm_mountingholediameter4mm_framethickness6mm",
    first: "size",
    invalid: { frameThickness: 30 },
  },
]
