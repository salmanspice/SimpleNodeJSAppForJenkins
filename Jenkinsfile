pipeline {
    agent any
    tools {nodejs "nodejs"}
     parameters {
        choice choices: ['Dev', 'staging', 'prod'], description: "Choose which environment to push changes to.", name: "DEPLOY_TO"
        // booleanParam defaultValue: true, "Choose whether to deploy the database.", name: "DEPLOY_DB"
    }
    environment {
        WORKSPACE = "${env.WORKSPACE}"
        DEPLOY_TO = "${params.DEPLOY_TO}"
    //     branch = 'main'
    //     scmUrl = 'https://github.com/salmanspice/SimpleNodeJSAppForJenkins.git'
              }

    stages {
        stage('checkout git') {
            steps {
                checkout changelog: false, poll: false, scm: scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'github-jenkins', url: 'https://github.com/salmanspice/SimpleNodeJSAppForJenkins.git']])
            }
        }
		stage('SonarQube analysis') {
        environment {
            scannerHome = tool 'sonar-scanner-printerpix'
        }
        steps {
            withSonarQubeEnv('sonar-jenkins') {
                sh '''
                ${scannerHome}/bin/sonar-scanner \
                -D sonar.projectKey=nodejs-pipeline \
                -D sonar.projectName=nodejs-pipeline \
                -D sonar.sources=.
                '''
            }
        }
    }
          stage('Install Dependencies of NodeJS') {
              steps {
                echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
                  echo 'building the nodejs application'
                  sh 'npm install'
              }
          }

    //       stage('Build the Project') {
    //            steps {
    //                 sh 'npm run build'
    //     }
    // }

    stage('Copy Artifact from Spring MVC project') {
        steps {
            
           echo "The build number is ${env.BUILD}"
            
            copyArtifacts(
                filter: "**/*.js",
                projectName: "Rollback",
                fingerprintArtifacts: true,
                selector: buildParameter('BUILD')
            )
        }
    }
          stage('deploy dev enviornment'){
            // when {
            //     branch 'dev'
            // }
            when {
                environment ignoreCase: true, name: "DEPLOY_TO", value: "dev"
            }
            steps {
                echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
                // deploy(developmentServer, serverPort)
                sshPublisher(publishers: [sshPublisherDesc(configName: 'dev', transfers: [sshTransfer(cleanRemote: false, excludes: 'node_modules', execCommand: 'cd /var/www/www.printerpix.com && pm2 restart index.js --name "Dev Job"', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '/', remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'index.js')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true)])
            }
        }

        stage('deploy staging enviornment'){
            // when {
            //     branch 'staging'
            // }
             when {
                environment ignoreCase: true, name: "DEPLOY_TO", value: "staging"
            }
            steps {
                echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
                // deploy(stagingServer, serverPort)
                input message: 'Dev Build is ok ? (Click "Proceed" to continue)'
                sshPublisher(publishers: [sshPublisherDesc(configName: 'staging', transfers: [sshTransfer(cleanRemote: false, excludes: 'node_modules', execCommand: 'cd /var/www/www.printerpix.com && pm2 restart index.js --name "Staging Job"', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '/', remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'index.js')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true)])
            }
        }

        stage('deploy production enviornment'){
            // when {
            //     branch 'prod'
            // }
            when {
                environment ignoreCase: true, name: "DEPLOY_TO", value: "prod"
            }
            steps {
                echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
                // deploy(productionServer, serverPort)
                // Create an Approval Button with a timeout of 2 minutes.
	                timeout(time: 3, unit: "MINUTES") {
	                    input message: 'Do you want to approve the deployment?', ok: 'Yes'
                   
	                }
                sshPublisher(publishers: [sshPublisherDesc(configName: 'prod', transfers: [sshTransfer(cleanRemote: false, excludes: 'node_modules', execCommand: 'cd /var/www/www.printerpix.com && pm2 restart index.js --name "Prod Job"', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '/', remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'index.js')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true)])
        }

          
    
 }
 }
}
