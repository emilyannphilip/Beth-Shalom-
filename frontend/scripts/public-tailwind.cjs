/* eslint-disable @typescript-eslint/no-require-imports -- Next.js loads this PostCSS plugin through CommonJS. */
const path = require("node:path");
const postcss = require("postcss");
const tailwind = require("tailwindcss-legacy");
const prefixSelector = require("postcss-prefix-selector");
const publicConfig = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "outline-variant": "#c1c8c3",
        "on-error": "#ffffff",
        "on-secondary-fixed-variant": "#1e5031",
        "surface-container-highest": "#d8e5e2",
        "inverse-surface": "#273331",
        "on-secondary": "#ffffff",
        "surface-variant": "#d8e5e2",
        "surface-bright": "#effcf9",
        "on-primary-container": "#86a496",
        surface: "#effcf9",
        "inverse-on-surface": "#e6f4f0",
        "surface-tint": "#486458",
        "secondary-container": "#b6edc2",
        "on-primary": "#ffffff",
        "secondary-fixed-dim": "#9dd3aa",
        "primary-fixed-dim": "#aecebe",
        "on-tertiary-fixed-variant": "#5a4300",
        "on-error-container": "#93000a",
        "surface-container-lowest": "#ffffff",
        tertiary: "#2a1e00",
        error: "#ba1a1a",
        "primary-container": "#1e3a2f",
        "on-secondary-container": "#3b6d4b",
        "surface-container": "#e3f1ed",
        "on-surface": "#121e1c",
        outline: "#727974",
        "on-secondary-fixed": "#00210e",
        "secondary-fixed": "#b9efc5",
        "on-surface-variant": "#424844",
        "on-primary-fixed-variant": "#304c41",
        "primary-fixed": "#caeada",
        "tertiary-fixed": "#ffdf98",
        secondary: "#376847",
        "surface-container-low": "#e9f7f3",
        "surface-container-high": "#ddebe8",
        "tertiary-container": "#443200",
        "on-tertiary-container": "#c19823",
        "on-tertiary": "#ffffff",
        "inverse-primary": "#aecebe",
        "surface-dim": "#cfddd9",
        "on-tertiary-fixed": "#251a00",
        "on-background": "#121e1c",
        primary: "#07241a",
        "on-primary-fixed": "#032017",
        background: "#effcf9",
        "tertiary-fixed-dim": "#eec14b",
        "error-container": "#ffdad6",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "space-xl": "3rem",
        "space-md": "1.25rem",
        "gutter-mobile": "1rem",
        "space-xs": "0.375rem",
        "space-sm": "0.75rem",
        "space-lg": "2rem",
        margin: "3rem",
        gutter: "1.5rem",
        "margin-mobile": "1.25rem",
      },
      fontFamily: {
        "headline-sm": ['"Plus Jakarta Sans"'],
        "headline-xl": ['"Plus Jakarta Sans"'],
        "body-lg": ["Source Sans 3"],
        "headline-lg-mobile": ['"Plus Jakarta Sans"'],
        "headline-xl-mobile": ['"Plus Jakarta Sans"'],
        "headline-lg": ['"Plus Jakarta Sans"'],
        "headline-md": ['"Plus Jakarta Sans"'],
        "label-lg": ["Source Sans 3"],
        "body-sm": ["Source Sans 3"],
        "body-md": ["Source Sans 3"],
        "label-md": ["Source Sans 3"],
        "label-sm": ["Source Sans 3"],
      },
      fontSize: {
        "headline-sm": [
          "22px",
          {
            lineHeight: "30px",
            fontWeight: "600",
          },
        ],
        "headline-xl": [
          "48px",
          {
            lineHeight: "56px",
            fontWeight: "600",
          },
        ],
        "body-lg": [
          "19px",
          {
            lineHeight: "30px",
            fontWeight: "400",
          },
        ],
        "headline-lg-mobile": [
          "28px",
          {
            lineHeight: "36px",
            fontWeight: "600",
          },
        ],
        "headline-xl-mobile": [
          "34px",
          {
            lineHeight: "42px",
            fontWeight: "600",
          },
        ],
        "headline-lg": [
          "36px",
          {
            lineHeight: "44px",
            fontWeight: "600",
          },
        ],
        "headline-md": [
          "26px",
          {
            lineHeight: "34px",
            fontWeight: "600",
          },
        ],
        "label-lg": [
          "16px",
          {
            lineHeight: "22px",
            fontWeight: "600",
          },
        ],
        "body-sm": [
          "15px",
          {
            lineHeight: "22px",
            fontWeight: "400",
          },
        ],
        "body-md": [
          "17px",
          {
            lineHeight: "26px",
            fontWeight: "400",
          },
        ],
        "label-md": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "600",
          },
        ],
        "label-sm": [
          "12px",
          {
            lineHeight: "16px",
            fontWeight: "600",
          },
        ],
      },
    },
  },
};

const scope = ':where([data-interface="public"])';

function publicTailwind() {
  return {
    postcssPlugin: "beth-shalom-public-tailwind",
    async Once(root, { result }) {
      const from = root.source?.input.file;
      if (
        !from?.endsWith(`${path.sep}public-theme.css`) &&
        !from?.endsWith("/public-theme.css")
      )
        return;

      const compiled = await postcss([
        tailwind({
          ...publicConfig,
          content: [
            path
              .join(path.dirname(from), "**/*.{ts,tsx}")
              .replaceAll("\\", "/"),
          ],
        }),
        prefixSelector({
          prefix: scope,
          transform(prefix, selector, prefixedSelector) {
            if (
              selector.includes('[data-interface="public"]') ||
              selector === "::-webkit-scrollbar"
            ) {
              return selector === "::-webkit-scrollbar"
                ? 'html:has([data-interface="public"])::-webkit-scrollbar'
                : selector;
            }
            if (
              selector === "html" ||
              selector === "body" ||
              selector === ":host" ||
              selector === ":root"
            ) {
              return prefix;
            }
            return prefixedSelector;
          },
        }),
      ]).process(root.toString(), { from });

      result.messages.push(...compiled.messages);
      root.removeAll();
      root.append(compiled.root.nodes);
    },
  };
}

module.exports = publicTailwind;
module.exports.postcss = true;
