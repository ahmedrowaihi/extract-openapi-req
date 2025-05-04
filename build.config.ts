import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index", "./src/frameworks/hono"],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
});
