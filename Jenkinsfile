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
                        cp "$ROOT_ENV_FILE" .env.dev
                        mkdir -p front
                        echo "$FRONT_ENV_TEXT" > front/.env
                    '''
                }
            }
        }

        stage('Docker Build & Up') {
            steps {
                sh 'docker compose -f docker-compose.dev.yml down || true'
                sh 'docker compose -f docker-compose.dev.yml up --build -d'
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker system prune -af || true'
            }
        }
    }
}