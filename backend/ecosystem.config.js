module.exports = {
  apps: [
    {
      name: "task-manager",
      script: "./server.js",
      cwd: "/var/www/task-manager/backend",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
