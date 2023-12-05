const build = {
  publish: [
    {
      provider: 's3',
      endpoint: process.env.AWS_ENDPOINT_URL,
      bucket: 'digital-signage-app'
    }
  ],
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      }
    ]
  },
  linux: {
    target: [
      {
        target: 'AppImage'
      }
    ]
  }
}

module.exports = build
