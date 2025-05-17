pipeline {
    agent any

    environment {
        CI = 'true'
    }

    stages {
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run backend with PM2') {
            steps {
                sh '''
                    sudo pm2 stop server || true
                    sudo pm2 delete server || true

                    sudo MONGO_URI=$MONGO_URI \
                         PORT=$PORT \
                         SECRET=$SECRET \
                         EMAIL=$EMAIL \
                         PASS=$PASS \
                         CI=true \
                         pm2 start server.js --name server
                '''
            }
        }
    }
}
