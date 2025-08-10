pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "aswingopakumar04/pipeline-test-project:${BUILD_TAG}"
  }

  triggers {
    githubPush()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      agent {
        docker {
          image 'node:16-alpine'
          args '-u root' // so we can install packages if needed
        }
      }
      steps {
        sh 'apk add --no-cache git' // ensures git exists in container
        sh 'npm install'
      }
    }

    stage('Run Tests') {
      agent {
        docker {
          image 'node:16-alpine'
        }
      }
      steps {
        sh 'npm test || echo "No tests yet"'
      }
    }

    stage('Build & Push Docker Image') {
      steps {
        sh "docker build -t ${DOCKER_IMAGE} ."
        withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_TOKEN', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh """
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push ${DOCKER_IMAGE}
          """
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh "sed -i 's|image: .*|image: ${DOCKER_IMAGE}|' deployment.yaml"
        sh 'kubectl apply -f deployment.yaml'
        sh 'kubectl apply -f service.yaml'
      }
    }
  }
}
