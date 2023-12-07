const build = {
  publish: [
    {
      provider: 's3',
      endpoint: process.env.AWS_ENDPOINT_URL,
      bucket: process.env.AWS_BUCKET_NAME
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
