#!/bin/bash

python generate-site.py --env prod \
&& GIT_DEPLOY_BRANCH=deploy GIT_DEPLOY_DIR=dist ./scripts/push-page.sh
