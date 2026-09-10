stage('Execute Tests') {
    steps {
        // Clean old results directory before execution
        bat 'if exist allure-results rmdir /s /q allure-results'
        
        // Run all contract tests in a single command
        bat 'npm run test:all'
    }
    post {
        always {
            // Inject generated contract artifact into Allure results
            bat 'if exist pacts\\OrderService-InventoryService.json copy pacts\\OrderService-InventoryService.json allure-results\\OrderService-InventoryService-contract.json'
            
            // Publish aggregated report
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
        }
    }
}