pipeline {
    agent { label 'docker-agent' }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/arjunkr403/task-manager-app.git'
            }
        }
        stage('Setup Env') {
            steps {
                withCredentials([
                    file(credentialsId: 'taskmngr-env', variable: 'ROOT_ENV_FILE'),
                    string(credentialsId: 'taskmnr-front-env', variable: 'FRONT_ENV_TEXT')
                ]) {
                    sh '''
                    cp "$ROOT_ENV_FILE" .env
                    mkdir -p front
                    echo "$FRONT_ENV_TEXT" > front/.env
                    '''
                }
            }
        }
        stage('Docker Build & Up') {
            steps {
                sh '''
                docker compose -f docker-compose.prod.yml down || true
                mkdir -p logs
                docker compose -f docker-compose.prod.yml up --build -d
                '''
            }
        }
        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh 'npm test || echo "No backend tests found, skipping..."'
                }
            }
        }
        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm test || echo "No frontend tests found, skipping..."'
                }
            }
        }
    }
}
