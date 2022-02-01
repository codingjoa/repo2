module.exports = {
  apps : [{
    name: 'react-spa',
    script: './server.front.js',
    watch: false,
    restart_delay: 30000,
    env: {
      'PORT': 3000,
      'HTTPS': true,
      'SSL_CRT_FILE': '/etc/letsencrypt/live/codingjoa.kro.kr/cert.pem',
      'SSL_KEY_FILE': '/etc/letsencrypt/live/codingjoa.kro.kr/privkey.pem'
    },
    env_dev: {
      'PORT': 5000,
      'HTTPS': false
    }
  }, {
    name: 'react-restAPI',
    script: './server/server.js',
    watch: false,
    restart_delay: 30000,
    env: {
      'MARIADB_PORT': 3306,
      'MARIADB_NAME': 'v1'
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
