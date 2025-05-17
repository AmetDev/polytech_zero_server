pipeline {
    agent any

    stages {
        stage('Show env') {
            steps {
                sh 'echo $NEXT_PUBLIC_SERVER_URL'
            }
        }

        stage('Run app') {
            steps {
                sh '''
                    sudo pm2 stop server || true
                    sudo pm2 delete server || true
                    sudo API_URL=$API_URL pm2 start server.js --name server
                '''
            }
        }
    }
}
