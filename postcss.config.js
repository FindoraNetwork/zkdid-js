// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: [
    require('postcss-preset-env')({
      autoprefixer: {
        // will add prefixes only for final and IE versions of specification
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
    require('postcss-normalize'),
  ],
};
