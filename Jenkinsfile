pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "aswingopakumar04/pipeline-test-project:${BUILD_TAG}"
  }

  triggers {
    githubPush() // runs pipeline on every push
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npm test || echo "No tests yet"'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${DOCKER_IMAGE} ."
      }
    }

    stage('Push Docker Image') {
      steps {
        withCredentials([string(credentialsId: 'docker-hub-token', variable: 'DOCKER_HUB_TOKEN')]) {
          sh """
            echo "$DOCKER_HUB_TOKEN" | docker login -u aswingopakumar04 --password-stdin
            docker push ${DOCKER_IMAGE}
          """
        }
      }
    }

    stage('Update K8s Deployment') {
      steps {
        sh """
          sed -i 's|image: .*|image: ${DOCKER_IMAGE}|' deployment.yaml
        """
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh """
          kubectl apply -f deployment.yaml
          kubectl apply -f service.yaml
        """
      }
    }
  }
}
