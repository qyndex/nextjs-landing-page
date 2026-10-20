import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path));
const manifest = JSON.parse(read("public/fonts/inter/SOURCE.json").toString());

describe("offline Inter provisioning", () => {
  it("retains every exact baseline asset and the upstream license", () => {
    expect(manifest.assets.map((asset: { subset: string }) => asset.subset)).toEqual([
      "cyrillic-ext", "cyrillic", "greek-ext", "greek", "vietnamese", "latin-ext", "latin",
    ]);
    for (const asset of manifest.assets) {
      const bytes = read(asset.path);
      expect(bytes.subarray(0, 4).toString()).toBe("wOF2");
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(asset.sha256);
    }
    const license = read("public/fonts/inter/OFL.txt");
    expect(createHash("sha256").update(license).digest("hex")).toBe(manifest.license.sha256);
    expect(license.toString()).toContain("Copyright 2020 The Inter Project Authors");
    expect(license.toString()).toContain("SIL OPEN FONT LICENSE Version 1.1");
  });

  it("provides all normal variable faces locally without a font downloader", () => {
    const css = read("src/app/inter-font.css").toString();
    expect(css.match(/font-family:Inter;font-style:normal;font-weight:100 900;font-display:swap/g)).toHaveLength(7);
    expect(css.match(/unicode-range:/g)).toHaveLength(7);
    for (const asset of manifest.assets) expect(css).toContain("/" + asset.path.replace(/^public\//, ""));
    expect(css).toContain("ascent-override:90.44%;descent-override:22.52%;line-gap-override:0.0%;size-adjust:107.12%");
    expect(css).not.toMatch(/https?:/);
    const layout = read("src/app/layout.tsx").toString();
    expect(layout).not.toContain("next/font/google");
    expect(layout).toContain('className="inter-variable"');
    expect(layout).toContain('/fonts/inter/inter-baseline-latin.woff2');
  });
});
