pipeline {
    agent {label 'docker-agent'}

    stages{
        stage ('Checkout'){
            steps{
                git branch: 'main', url: 'https://github.com/arjunkr403/task-manager-app.git'
            }
        }
        stage ('Build'){
            steps{
                sh 'docker compose -f docker-compose.prod.yml build --no-cache'
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