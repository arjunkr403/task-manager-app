pipeline {
    agent { label 'docker-agent' }
    options {
        timeout(time: 15, unit: 'MINUTES')
    }
    stages {
        stage('Setup Env') {
            steps {
                withCredentials([
                    file(credentialsId: 'taskmngr-env-prod', variable: 'ROOT_ENV_FILE'),
                    string(credentialsId: 'taskmngr-front-env', variable: 'FRONT_ENV_TEXT')
                ]) {
                    sh '''
                        mkdir -p front
                        rm -f .env front/.env
                        cp "$ROOT_ENV_FILE" .env
                        printf "%s" "$FRONT_ENV_TEXT" > front/.env
                    '''
                }
            }
        }
        stage('Build Images') {
            steps {
                sh 'docker compose -f docker-compose.prod.yml build'
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    docker compose -f docker-compose.prod.yml \
                    up -d --remove-orphans
                '''
            }
        }
    }
     post {
        always {
            sh 'docker compose -f docker-compose.prod.yml down --remove-orphans || true'
            sh 'docker system prune -af || true'
        }
    }
    // post {
    //     failure {
    //         echo "❌ Deployment failed"
    //     }
    //     success {
    //         echo "✅ Deployment successful"
    //     }
    // }
}