pipeline {
    agent any

    tools {
        nodejs 'NodeJS-18' // Matches your Jenkins Global Tool Configuration name
    }

    environment {
        CI = 'true'
        ALLURE_RESULTS_DIR = 'allure-results'
        //PACT_BROKER_BASE_URL = 'http://localhost:9292'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

       stage('Environment Setup') {
        steps {
        echo 'Cleaning old reports...'
        bat 'if exist allure-results rmdir /s /q allure-results'
        bat 'mkdir allure-results'
        bat 'npm ci'
    }
}

        stage('Code Quality & Lint') {
            steps {
                echo 'Running static analysis and type checks...'
                bat 'npm run lint --if-present'
                bat 'npx tsc --noEmit'
            }
        }

        stage('Consumer Contract Tests') {
            steps {
                echo 'Executing Pact Consumer tests & generating contracts...'
                // Executes consumer tests, outputting Pact files to ./pacts and Allure data to ./allure-results
                bat 'npm run test:consumer'
            }
           /* post {
                always {
                    // Preserve generated contract artifacts
                    archiveArtifacts artifacts: 'pacts/*.json', allowEmptyArchive: true
                }
            }*/
        }

        stage('Provider Contract Verification') {
            steps {
                echo 'Verifying Provider against Pact contracts...'
                // Runs Pact provider verification against local contracts or Pact Broker
                bat 'npm run test:provider'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up Docker resources...'
            // bat 'docker-compose down'

            echo 'Generating Allure Report...'
            // Generates and attaches the interactive Allure Dashboard to the Jenkins job page
            allure includeProperties: false, 
                   jdk: '', 
                   results: [[path: 'allure-results']]
        }
        success {
            echo 'Pipeline executed successfully! All contract tests passed.'
        }
        failure {
            echo 'Pipeline failed. Check Allure Report and logs for contract mismatches.'
        }
    }
}