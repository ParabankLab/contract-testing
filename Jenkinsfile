pipeline {
    agent any

    stages {
        stage('Execute Tests') {
            steps {
                // Clean old test results before running
                bat 'if exist allure-results rmdir /s /q allure-results'
                bat 'npm run test:all'
            }
        }
    }
    
    post {
        always {
            // Inject contract JSON directly into Allure result metadata
            powershell '''
                $pactFile = "pacts\\OrderService-InventoryService.json"
                $resultsDir = "allure-results"

                if ((Test-Path $pactFile) -and (Test-Path $resultsDir)) {
                    # Copy contract file to allure-results directory
                    $attachmentFile = "$resultsDir\\contract-attachment.json"
                    Copy-Item $pactFile $attachmentFile

                    # Find consumer test result JSON file in allure-results
                    $targetJson = Get-ChildItem "$resultsDir\\*-result.json" | Where-Object { 
                        (Get-Content $_.FullName | ConvertFrom-Json).name -like "*fetches inventory item details*" 
                    } | Select-Object -First 1

                    if ($targetJson) {
                        $jsonContent = Get-Content $targetJson.FullName | ConvertFrom-Json
                        
                        # Build Allure attachment definition
                        $newAttachment = [PSCustomObject]@{
                            name   = "OrderService-InventoryService.json"
                            source = "contract-attachment.json"
                            type   = "application/json"
                        }

                        # Append to attachments array inside test metadata
                        if (-not $jsonContent.attachments) {
                            $jsonContent | Add-Member -MemberType NoteProperty -Name "attachments" -Value @($newAttachment)
                        } else {
                            $jsonContent.attachments += $newAttachment
                        }

                        # Write back updated metadata JSON
                        $jsonContent | ConvertTo-Json -Depth 10 | Set-Content $targetJson.FullName
                    }
                }
            '''

            // Archive the raw contract file as a Jenkins artifact
            archiveArtifacts artifacts: 'pacts/*.json', allowEmptyArchive: true

            // Generate and publish Allure report
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
        }
    }
}