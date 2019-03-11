import jinja2
import logging
import shutil
import os
import json
import pandas as pd
from distutils.dir_util import copy_tree
import argparse
import datetime


logging.basicConfig(format='%(asctime)s| %(message)s', level=logging.INFO)

DEST_LOCATION = './dist'
config = {
    'dev': {
        'path': '%s/dist' % os.environ.get('WEBPATH', 'localhost:8000')
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


deploy_path = config[args.environment]['path']

def prepend_dir(path):
    return '%s/%s' % (DEST_LOCATION, path)

def cache_buster_url(url, cache_key=datetime.datetime.today().strftime('%Y-%m-%d-%H-%M')):
    return '%s?v=%s' % (url, cache_key)

if os.path.exists(DEST_LOCATION):
    shutil.rmtree(DEST_LOCATION)
os.mkdir(DEST_LOCATION)

copy_tree('./election62/statics', prepend_dir('statics'))

templateEnv = jinja2.Environment(
    extensions=['jinja2_time.TimeExtension'],
    loader=jinja2.PackageLoader('election62', 'templates')
)

templateEnv.filters['cache_buster'] = cache_buster_url

logging.info('Generating files for %s' % config[args.environment]['path'])

# render frontpage
logging.info('Rendering index.html')
template = templateEnv.get_template('index.html')
template.stream(deploy_path=deploy_path, env=args.environment).dump(prepend_dir('index.html'))

# render zone pages
logging.info('Rendering zone pages')
with open('./data/election-zones.json') as ez:  
    election_zones = json.load(ez)

with open('./data/party-abbrevations.json') as pe:  
    party2abbv = dict(map(lambda x: (x['name'], x['id']), json.load(pe)))
    
df_candidates = pd.read_csv('./data/detailed-candidates.csv')
df_candidates['party_abbv'] = df_candidates.PartyName.apply(lambda x: party2abbv.get(x, None))

os.mkdir(prepend_dir('z'))

template = templateEnv.get_template('zone.html')
for ez in election_zones:
    candidates = df_candidates[
            (df_candidates['province_name'] == ez['province']) &
            (df_candidates['zone_number'] == ez['zone'])
        ].to_dict('records')

    filename = '%s-%s' % (ez['province'], ez['zone'])
    if len(candidates) < 10:
        logging.info('Zone %s has <10 candidates, skip it!' % filename)
    else:
        candidates = sorted(candidates, key=lambda x: x['CandidateNo'])
        template.stream(deploy_path=deploy_path, zone=ez, candidates=candidates, env=args.environment) \
            .dump(prepend_dir('z/%s.html' % filename))

# render party pages
logging.info('Rendering party pages')
os.mkdir(prepend_dir('p'))

template = templateEnv.get_template('party.html')

with open('./data/party-information.json') as pt:  
    party_info = json.load(pt)

for p in party_info:
    filename = p['slug']
    p['party_abbv'] = party2abbv.get(p['slug'], None)

    template.stream(deploy_path=deploy_path, env=args.environment, party=p) \
        .dump(prepend_dir('p/%s.html' % filename))