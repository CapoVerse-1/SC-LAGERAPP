/**
 * Turbopack configuration
 * @type {import('next/dist/server/config-shared').TurbopackConfig}
 */
module.exports = {
  // Optimierungen für die Entwicklung
  dev: {
    // Aktiviere Hot Module Replacement
    hmr: true,
    // Optimiere die Ladezeit
    fastRefresh: true,
    // Optimiere die Kompilierungszeit
    persistent: true,
    // Optimiere die Speichernutzung
    memoryLimit: 4096,
  },
  // Optimierungen für die Produktion
  build: {
    // Optimiere die Buildzeit
    minify: true,
    // Optimiere die Bundlegröße
    treeshake: true,
    // Optimiere die Caching-Strategie
    cache: true,
  },
  // Webpack-Kompatibilität
  webpack: {
    // Verwende Webpack-Konfiguration aus next.config.mjs
    useNextConfig: true,
    // Optimiere die Webpack-Leistung
    lazyCompilation: true,
  },
  // Optimiere die Reaktionszeit
  reactRefresh: {
    // Aktiviere Fast Refresh
    fastRefresh: true,
  },
} 