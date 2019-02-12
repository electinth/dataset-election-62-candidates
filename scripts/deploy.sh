#!/bin/bash

export GIT_DEPLOY_REPO=git@gitlab.com:elect.in.th/zone-and-candidate-info.git
export GIT_DEPLOY_BRANCH=deploy
export GIT_DEPLOY_DIR=dist 

python generate-site.py --env prod \
&& ./scripts/push-page.sh
