pipeline {
    agent { label 'docker-agent' }

    stages {
        stage('Build-new') {
            steps {
                echo "Building code from new_master branch"
            }
        }

        stage('Deploy-new') {
            steps {
                echo "Deploying new_master branch (test deployment)..."
            }
        }
    }
}

