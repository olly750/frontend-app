module.exports = {
  apps: [
    {
      name: 'frontend-services',
      script: 'yarn start-prod --port=5000',
      watch: true,
      env: {
        HOST: '0.0.0.0',
        NODE_ENV: 'production',
      },
    },
  ],
};
