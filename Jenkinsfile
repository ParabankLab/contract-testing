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
            powershell '''
                $pactFile = "pacts\\OrderService-InventoryService.json"
                $resultsDir = "allure-results"

                if ((Test-Path $pactFile) -and (Test-Path $resultsDir)) {
                    $attachmentFile = "$resultsDir\\contract-attachment.json"
                    Copy-Item $pactFile $attachmentFile

                    $targetJson = Get-ChildItem "$resultsDir\\*-result.json" | Where-Object { 
                        (Get-Content $_.FullName | ConvertFrom-Json).name -like "*fetches inventory item details*" 
                    } | Select-Object -First 1

                    if ($targetJson) {
                        $jsonContent = Get-Content $targetJson.FullName | ConvertFrom-Json
                        
                        $newAttachment = [PSCustomObject]@{
                            name   = "OrderService-InventoryService.json"
                            source = "contract-attachment.json"
                            type   = "application/json"
                        }

                        # Safely handle pre-existing attachments property
                        if ($null -eq $jsonContent.attachments) {
                            $jsonContent | Add-Member -MemberType NoteProperty -Name "attachments" -Value @($newAttachment) -Force
                        } else {
                            $existingAttachments = [System.Collections.ArrayList]@($jsonContent.attachments)
                            $null = $existingAttachments.Add($newAttachment)
                            $jsonContent.attachments = $existingAttachments
                        }

                        $jsonContent | ConvertTo-Json -Depth 10 | Set-Content $targetJson.FullName
                    }
                }
            '''

            archiveArtifacts artifacts: 'pacts/*.json', allowEmptyArchive: true
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
        }
    }
}