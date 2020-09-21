const { extendNextConfig } = require("./packages/@vulcan/next-config");
const withTM = require('next-transpile-modules')(['@vulcan/next-apollo']); // pass the modules you would like to see transpiled

//const withMDX = require("@next/mdx")({ extension: /\.mdx?$/ });
const withMDXEnhanced = require("next-mdx-enhanced");

const flowRight = require("lodash/flowRight");
const debug = require("debug")("vns:next");

// fooBar => FOO_BAR
const camelToTitle = (camelStr) => {
  return camelStr
    .replace(/[A-Z]/g, " $1") // fooBar => foo Bar
    .split(" ")
    .map((t) => t.toUpperCase())
    .join("_");
};

// NOTE: NEVER import package.json elswhere in your app!
// We can import it here because next.config is not in the client side bundle
// We then pass only the relevant values in the config
const packageJSON = require("./package.json");

// Add package.json metadata to runtime configs and environment
const withPkgInfo = (nextConfig = {}) => {
  // Public
  // It's still unclear where such config should go
  // @see https://github.com/vercel/next.js/discussions/14308
  const publicPkgInfo = {
    version: packageJSON.version,
  };
  nextConfig.publicRuntimeConfig.pkgInfo = publicPkgInfo;
  // Also enhance environment with the same infos
  Object.entries(publicPkgInfo).map(([key, value]) => {
    const envKey = `NEXT_PUBLIC_PKGINFO_${camelToTitle(key)}`;
    nextConfig.env[envKey] = `${value}`; // we convert to string
  });

  return nextConfig;
};

const withMDX = withMDXEnhanced({
  layoutPath: "src/components/layout/mdx", // allow to select layouts in the MD page
  defaultLayout: true,
  fileExtensions: ["mdx", "md"],
  extendFrontMatter: {
    process: (content, rawFrontMatter) => {
      const frontMatterExtension = {};
      // we guess the layout based on the file folder
      if (!!rawFrontMatter.__resourcePath.match(/docs/)) {
        frontMatterExtension.layout = "doc-page";
      }
      return frontMatterExtension;
    },
  },
});

// @see https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
module.exports = (phase, { defaultConfig }) => {
  let extendedConfig;
  extendedConfig = extendNextConfig(defaultConfig);

  extendedConfig.env = {};
  extendedConfig.serverRuntimeConfig = {};
  extendedConfig.publicRuntimeConfig = {};

  // Enable Webpack analyzer
  if (process.env.ANALYZE && process.env.ANALYZE !== "false") {
    const debug = require("debug")("webpack");
    debug("Enabling Webpack bundle analyzer");
    const withBundleAnalyzer = require("@next/bundle-analyzer")({
      enabled: process.env.ANALYZE === "true",
    });
    extendedConfig = withBundleAnalyzer(extendedConfig);
  }

  // To support markdown import
  extendedConfig.pageExtensions = ["js", "jsx", "md", "mdx", "ts", "tsx"];
  extendedConfig = flowRight([
    withPkgInfo,
    withMDX,
    withTM
    // add other wrappers here
  ])(extendedConfig);

  debug("Extended next config FINAL " + JSON.stringify(extendedConfig));

  return extendedConfig;
};
