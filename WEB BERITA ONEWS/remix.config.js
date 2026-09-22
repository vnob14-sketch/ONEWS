/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  server: "./server.js",
  serverBuildPath: "functions/[[path]].js",
  serverConditions: ["workerd", "worker", "browser"], // Ditambahkan dukungan worker
  serverDependenciesToBundle: "all",
  serverMainFields: ["browser", "module", "main"],
  serverMinify: true,
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  serverNodeBuiltinsPolyfill: {
    modules: {
      stream: true, // Memaksa injeksi polyfill otomatis untuk modul "stream"
      crypto: true
    }
  }
};

