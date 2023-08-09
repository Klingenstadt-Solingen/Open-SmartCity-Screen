module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer'
    }
    config.module = {
      ...config.module,
      exprContextCritical: false
    }

    return config
  }
}
