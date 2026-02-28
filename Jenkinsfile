pipeline {
    agent { label 'docker-agent' }

    options {
        timeout(time: 15, unit: 'MINUTES')
    }

    stages {
        stage('Setup Env') {
            steps {
                withCredentials([
                    file(credentialsId: 'taskmngr-env-test', variable: 'ROOT_ENV_FILE')
                ]) {
                    sh '''
                        rm -f .env
                        cp "$ROOT_ENV_FILE" .env
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                sh 'docker compose -f docker-compose.test.yml down || true'
                sh '''
                    docker compose -f docker-compose.test.yml \
                    up --build \
                    --abort-on-container-exit \
                    --exit-code-from back
                '''
            }
        }
    }

    post {
        always {
            sh 'docker compose -f docker-compose.test.yml down --volumes --remove-orphans || true'
        }
    }
}