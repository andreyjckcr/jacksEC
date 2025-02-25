module.exports = {
  apps: [
      {
          name: 'jacksEC',
          script: 'node_modules/next/dist/bin/next',
          args: 'start -p 3000',
          interpreter: 'node',
          instances: 1,
          exec_mode: 'fork',
          env: {
              NODE_ENV: 'development',
          },
          env_production: {
              NODE_ENV: 'production',
          }
      },
  ],
};
