module.exports = {
  apps : [{
    name: 'react',
    script: 'npm',
    args: 'start',
    watch: false
  }, {
    name: 'restAPI',
    script: './server/server.js',
    watch: ['./server'],
    restart_delay: 10000
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
