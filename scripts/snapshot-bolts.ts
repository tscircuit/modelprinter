import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const root = resolve(import.meta.dir, "..")
const build = await Bun.build({
  entrypoints: [resolve(import.meta.dir, "bolt-snapshot-scene.ts")],
  target: "browser",
})
if (!build.success) throw new Error(build.logs.join("\n"))
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
})
try {
  const page = await browser.newPage({
    viewport: { width: 1400, height: 1152 },
    deviceScaleFactor: 1,
  })
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.setContent(`<!doctype html><html><head><style>
    * { box-sizing: border-box; } body { margin: 0; background: #e3e9f0; color: #1d2e43; font-family: Arial, sans-serif; padding: 32px; }
    header { height: 102px; } h1 { font-size: 30px; margin: 0 0 10px; letter-spacing: -0.5px; }
    header p { margin: 0; font-size: 16px; color: #506277; }
    main { display: grid; grid-template-columns: repeat(2, 660px); gap: 16px; }
    section { height: 472px; overflow: hidden; position: relative; border: 1px solid #cad4df; border-radius: 10px; background: #f1f4f8; }
    .label { position: absolute; top: 18px; left: 22px; font-size: 13px; font-weight: bold; letter-spacing: 2px; }
    .detail { position: absolute; bottom: 17px; left: 22px; font-size: 13px; color: #506277; }
    canvas { display: block; margin-top: 12px; }
    footer { margin-top: 17px; color: #506277; font-size: 12px; }
  </style></head><body><header><h1>M3 × 6 mm · Metric hex socket bolt</h1>
  <p>hexsocketbolt_m3_l6mm &nbsp; / &nbsp; 0.5 mm pitch &nbsp; / &nbsp; 3 mm head height &nbsp; / &nbsp; orthographic views</p></header>
  <main></main><footer>Generated from modelprinter mesh · Nominal ISO 4762 / DIN 912 dimensions · Threads are a visual approximation · All dimensions in mm</footer></body></html>`)
  await page.addScriptTag({ content: await build.outputs[0]!.text() })
  await page.waitForFunction(() => document.body.dataset.ready === "true")
  if (errors.length) throw new Error(errors.join("\n"))
  const output = resolve(root, "tests/__snapshots__/hexsocketbolt-m3-6mm.png")
  await mkdir(resolve(root, "tests/__snapshots__"), { recursive: true })
  await page.screenshot({ path: output })
  console.log(output)
} finally {
  await browser.close()
}
