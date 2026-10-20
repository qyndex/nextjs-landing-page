#!/usr/bin/env python3
"""Losslessly restore a supplied local observation; hashes do not authenticate it."""
import argparse
import hashlib
import json
from pathlib import Path
import re

def require(condition, message):
    if not condition:
        raise ValueError(message)


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('presentation', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()
value = json.loads(args.presentation.read_text())
require(value['format'] == 'ordered-source-manifest-v1', 'unsupported presentation format')
restored = {}
for key, item in value['payload'].items():
    if key == 'ordered_source_manifest_entries':
        mapping = {}
        for row in item:
            require(set(row) == {'path', 'sha256'}, 'invalid manifest entry')
            require(isinstance(row['path'], str) and row['path'] not in mapping, 'invalid/duplicate path')
            require(re.fullmatch(r'[0-9a-f]{64}', row['sha256']), 'invalid source digest')
            mapping[row['path']] = row['sha256']
        restored['source_sha256'] = mapping
    else:
        restored[key] = item
blob = (json.dumps(restored, indent=2) + '\n').encode()
require(hashlib.sha256(blob).hexdigest() == value['original_raw_sha256'], 'reconstruction differs from exact original bytes')
with args.output.open('xb') as target:
    target.write(blob)
print(value['original_raw_sha256'])
