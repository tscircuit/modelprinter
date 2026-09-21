import * as THREE from "three"
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js"
import { createHexSocketBoltMesh, mp } from "../src"

const definition = mp.string("hexsocketbolt_m3_l6mm").json()
if (definition.fn !== "hexsocketbolt") throw new Error("Expected bolt")
const { fn, ...props } = definition
const mesh = createHexSocketBoltMesh(props)
const geometry = new THREE.BufferGeometry()
geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(mesh.positions, 3),
)
geometry.setIndex(mesh.indices)
// Smooth cylindrical facets while preserving hex walls and thread flanks.
const surface = toCreasedNormals(geometry, Math.PI / 9)
const material = new THREE.MeshStandardMaterial({
  color: 0x91a0b2,
  metalness: 0.38,
  roughness: 0.36,
})
const views = [
  {
    name: "ISOMETRIC",
    detail: "Head, socket & right-hand thread",
    eye: [11, -16, 12],
    target: [0, 0, -1.4],
    span: 11.8,
  },
  {
    name: "TOP",
    detail: "2.5 mm hex socket · Ø 5.5 mm head",
    eye: [0, 0, 20],
    target: [0, 0, 0],
    span: 8.5,
  },
  {
    name: "FRONT",
    detail: "6 mm under head · 9 mm overall",
    eye: [0, -20, -1.5],
    target: [0, 0, -1.5],
    span: 11.4,
  },
  {
    name: "UNDERSIDE",
    detail: "Bearing face, thread runout & tip",
    eye: [-12, -17, -13],
    target: [0, 0, -1.7],
    span: 11.8,
  },
]
for (const view of views) {
  const section = document.createElement("section")
  section.innerHTML = `<div class="label">${view.name}</div><div class="detail">${view.detail}</div>`
  document.querySelector("main")!.append(section)
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
  })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setSize(660, 440)
  renderer.setPixelRatio(1)
  renderer.setClearColor(0xf1f4f8)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25
  section.append(renderer.domElement)
  const scene = new THREE.Scene()
  const bolt = new THREE.Mesh(surface, material)
  bolt.castShadow = true
  bolt.receiveShadow = true
  scene.add(bolt)
  scene.add(new THREE.HemisphereLight(0xe9f1ff, 0x5b6674, 2.3))
  for (const [x, y, z, intensity] of [
    [-7, -10, 14, 4],
    [8, 3, 8, 3],
    [-5, 5, -9, 2],
  ]) {
    const light = new THREE.DirectionalLight(0xffffff, intensity)
    light.position.set(x!, y!, z!)
    if (z === 14) {
      light.castShadow = true
      light.shadow.mapSize.set(2048, 2048)
      Object.assign(light.shadow.camera, {
        left: -8,
        right: 8,
        top: 8,
        bottom: -8,
        near: 0.1,
        far: 50,
      })
      light.shadow.bias = -0.00005
      light.shadow.normalBias = 0.01
    }
    scene.add(light)
  }
  const aspect = 660 / 440
  const half = view.span / 2
  const camera = new THREE.OrthographicCamera(
    -half * aspect,
    half * aspect,
    half,
    -half,
    0.1,
    100,
  )
  camera.up.set(0, 0, 1)
  if (view.name === "TOP") camera.up.set(0, 1, 0)
  camera.position.set(...(view.eye as [number, number, number]))
  camera.lookAt(...(view.target as [number, number, number]))
  renderer.render(scene, camera)
}
document.body.dataset.ready = "true"
