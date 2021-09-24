#!/bin/bash

set -e
docker -v

# test if directory is empty
if [ ! -d "./dist" ] || [ -z "$(ls ./dist)" ] ; then
  echo "Empty dist, exit"
  exit
fi


# login to ecr
echo "[*] Login to ECR"
token=$(aws ecr get-login-password)
result=$(docker login --username AWS -p $token 488938767527.dkr.ecr.us-east-2.amazonaws.com)
if [ "$result" != "Login Succeeded" ] ; then
  echo "Login to ECR Failed. Please contact li.zhou@veoride.com for further instructions."
  exit
fi
echo "[*] Login process done"


docker build -t "488938767527.dkr.ecr.us-east-2.amazonaws.com/veo-service:manhattan-frontend-${CI_COMMIT_SHA}" .
docker push "488938767527.dkr.ecr.us-east-2.amazonaws.com/veo-service:manhattan-frontend-${CI_COMMIT_SHA}"