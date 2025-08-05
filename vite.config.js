/**
 * @type {import('vite').UserConfig}
 */
export default {
  base:
    process.env.NODE_ENV === "production"
      ? "/sonic3bonusgameplay.github.io/"
      : "",
};
