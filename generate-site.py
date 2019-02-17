import jinja2
import logging
import shutil
import os
import json
import pandas as pd
from distutils.dir_util import copy_tree
import argparse

logging.basicConfig(format='%(asctime)s| %(message)s', level=logging.INFO)

DEST_LOCATION = './dist'
config = {
    'dev': {
        'path': '192.168.0.125:7777/dist'  
    },
    'stage': {
        'path': 'pat.chormai.org/election-62-staging'  
    },
    'prod': {
        'path': 'elect.in.th/candidates'  
    }
}


parser = argparse.ArgumentParser(description='Generate election 2556 candidate sites')
parser.add_argument('--env', dest='environment', help='environment to generate')

args = parser.parse_args()

logging.info('Generating files for %s' % args.environment)

deploy_path = config[args.environment]['path']

def prepend_dir(path):
    return '%s/%s' % (DEST_LOCATION, path)

if os.path.exists(DEST_LOCATION):
    shutil.rmtree(DEST_LOCATION)
os.mkdir(DEST_LOCATION)

# todo: copy statics to dist
copy_tree('./election62/statics', prepend_dir('statics'))

templateEnv = jinja2.Environment(
    extensions=['jinja2_time.TimeExtension'],
    loader=jinja2.PackageLoader('election62', 'templates')
)

logging.info('Rendering index.html')
template = templateEnv.get_template('index.html')
template.stream(deploy_path=deploy_path, env=args.environment).dump(prepend_dir('index.html'))

logging.info('Rendering zone pages')
with open('./data/election-zones.json') as ez:  
    election_zones = json.load(ez)

df_candidates = pd.read_csv('./data/election-62-candidates.csv')

os.mkdir(prepend_dir('z'))

template = templateEnv.get_template('zone.html')
for ez in election_zones:
    candidates = df_candidates[
            (df_candidates['province'] == ez['province']) &
            (df_candidates['zone'] == ez['zone'])
        ].to_dict('records')

    filename = '%s-%s' % (ez['province'], ez['zone'])
    if len(candidates) < 10:
        # something goes wrong here?
        logging.info('Zone %s has <10 candidates, skip it!' % filename)
    else:
        candidates = sorted(candidates, key=lambda x: x['no.'])
        template.stream(deploy_path=deploy_path, zone=ez, candidates=candidates) \
            .dump(prepend_dir('z/%s.html' % filename))