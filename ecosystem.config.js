module.exports = {
  apps : [{
    name: 'react',
    script: 'npm',
    args: 'start',
    watch: false,
    restart_delay: 30000,
    env: {
      'HTTPS': true,
      'SSL_CRT_FILE': './ssl/cert.crt',
      'SSL_KEY_FILE': './ssl/cert.key'
    },
    env_dev: {
      'HTTPS': false
    }
  }, {
    name: 'restAPI',
    script: './server/server.js',
    watch: false,
    restart_delay: 30000,
    env: {
      'MARIADB_PORT': 3306,
      'MARIADB_NAME': 'v1',
      'NODE_ENV': 'production'
    },
    env_dev: {
      'MARIADB_PORT': 3306,
      'MARIADB_NAME': 'ky',
      'DEBUG': '1',
      'ERROR': '1'
    }
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
