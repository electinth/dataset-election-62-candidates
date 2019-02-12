#!/bin/bash

python generate-site.py --env prod \
&& ghpages -p dist
