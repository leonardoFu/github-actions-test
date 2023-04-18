module.exports = api => {
  if (api.env('test')) {
    return {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
      plugins: [
        [
          'inline-svg',
          {
            svgo: {
              plugins: [
                {
                  removeViewBox: false,
                  removeDimensions: true
                }
              ]
            }
          }
        ]
      ]
    }
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          corejs: 3
        }
      ]
    ],
    plugins: [
      '@babel/plugin-transform-runtime'
    ]
  }
}
