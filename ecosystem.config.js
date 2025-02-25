module.exports = {
    apps: [
      {
        name: 'jacksEC',
        script: 'node_modules/next/dist/bin/next',
        args: 'start -p 3000',
        interpreter: 'node', // Esto asegura que se use Node.js, no cmd
        instances: 1,
        exec_mode: 'fork',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
   };