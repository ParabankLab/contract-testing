pipeline {
    agent any

    stages {
        stage('Execute Tests') {
            steps {
                bat 'if exist allure-results rmdir /s /q allure-results'
                bat 'npm run test:all'
            }
        }
    }
    
    post {
        always {
            // Archive the generated Pact JSON contract as a Jenkins artifact
            archiveArtifacts artifacts: 'pacts/*.json', allowEmptyArchive: false
            
            // Publish Allure Report
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
        }
    }
}