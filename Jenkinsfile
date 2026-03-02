pipeline {
    agent { label 'docker-agent' }
    stages {
        stage('Setup Env') {
            steps {
                withCredentials([
                    file(credentialsId: 'taskmngr-env-dev', variable: 'ROOT_ENV_FILE'),
                    string(credentialsId: 'taskmngr-front-env', variable: 'FRONT_ENV_TEXT')
                ]) {
                    sh '''
                        mkdir -p front
                        rm -f .env.dev front/.env
                        cp "$ROOT_ENV_FILE" .env.dev
                        printf "%s" "$FRONT_ENV_TEXT" > front/.env
                    '''
                }
            }
        }
        stage('Docker Build & Up') {
            steps {
                sh 'docker compose -f docker-compose.dev.yml down --remove-orphans || true'
                sh 'docker compose -f docker-compose.dev.yml up --build -d'
            }
        }
    }
    post {
        always {
            sh 'docker compose -f docker-compose.dev.yml down --remove-orphans || true'
            sh 'docker builder prune -af || true'
        }
    }
}