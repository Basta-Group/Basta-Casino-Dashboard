module.exports = {
  apps: [
    {
      name: 'basta-casino-dashboard',
      script: 'node_modules/.bin/vite',
      args: 'preview --host 0.0.0.0 --port 3001',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
