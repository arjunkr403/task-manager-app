pipeline {
    agent { label 'docker-agent' }

    stages {
        stage('Setup Env') {
            steps {
                withCredentials([
                    file(credentialsId: 'taskmngr-env', variable: 'ROOT_ENV_FILE'),
                    string(credentialsId: 'taskmnr-front-env', variable: 'FRONT_ENV_TEXT')
                ]) {
                    sh '''
                    echo "Setting up environment for branch: $BRANCH_NAME"
                    cp "$ROOT_ENV_FILE" .env
                    mkdir -p frontend
                    echo "$FRONT_ENV_TEXT" > frontend/.env
                    '''
                }
            }
        }

        stage('Docker Build & Up') {
            steps {
                script {
                    if (env.BRANCH_NAME == "master") {
                        sh 'docker compose -f docker-compose.prod.yml down || true'
                        sh 'docker compose -f docker-compose.prod.yml up --build -d'
                    } else if (env.BRANCH_NAME == "dev") {
                        sh 'docker compose -f docker-compose.dev.yml down || true'
                        sh 'docker compose -f docker-compose.dev.yml up --build -d'
                    } else {
                        sh 'docker compose -f docker-compose.test.yml down || true'
                        sh 'docker compose -f docker-compose.test.yml up --build -d'
                    }
                }
            }
        }

        stage('Tests') {
            steps {
                script {
                    if (fileExists('backend/package.json')) {
                        dir('backend') {
                            sh 'npm test || echo "No backend tests found, skipping..."'
                        }
                    }
                    if (fileExists('frontend/package.json')) {
                        dir('frontend') {
                            sh 'npm test || echo "No frontend tests found, skipping..."'
                        }
                    }
                }
            }
        }
    }
}

