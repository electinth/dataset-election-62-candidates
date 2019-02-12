#!/bin/bash

GIT_DEPLOY_REPO=git@gitlab.com:elect.in.th/zone-and-candidate-info.git
GIT_DEPLOY_BRANCH=deploy
GIT_DEPLOY_DIR=dist
python generate-site.py --env prod \
&& ./scripts/push-page.sh
