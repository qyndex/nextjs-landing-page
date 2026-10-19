"""Real HTTP checks; invoke only after isolated-stack preflight and API startup.
No database mocks. A separate local SQL observation must establish persistence/RLS.
"""
import json
import os
import urllib.error
import urllib.parse
import urllib.request
import uuid
import subprocess
import re


def local_url(value):
    parsed = urllib.parse.urlsplit(value)
    if (parsed.scheme != 'http' or parsed.hostname != '127.0.0.1'
            or parsed.username or parsed.password or parsed.query or parsed.fragment
            or parsed.path not in ('', '/') or not parsed.port):
        raise ValueError('An explicit http://127.0.0.1:PORT origin is required')
    return value.rstrip('/')


def request(url, method='GET', payload=None, headers=None):
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, method=method,
                                 headers={'Content-Type': 'application/json', **(headers or {})})
    # Ignore inherited proxy settings; never follow redirects off the local origin.
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *args, **kwargs):
            return None
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())
    try:
        response = opener.open(req, timeout=15)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        raw = response.read(65537)
        assert len(raw) <= 65536, 'Unexpectedly large response'
        return response.status, json.loads(raw) if raw else None


def database_rows(email):
    if not re.fullmatch(r'factory-[a-f0-9]{32}@example[.]test', email):
        raise ValueError('Only the generated synthetic address may enter SQL')
    container = 'supabase_db_factory-db-20261019'
    actual = subprocess.check_output(['docker', 'inspect', '--format', '{{.Id}}', container], text=True).strip()
    if actual != os.environ['FACTORY_LOCAL_DB_CONTAINER_ID']:
        raise RuntimeError('Disposable database identity changed')
    sql = "select coalesce(json_agg(t), '[]'::json) from (select email,name,referral_source from public.waitlist order by email) t;"
    raw = subprocess.check_output(['docker', 'exec', '-i', container, 'psql', '-X', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'postgres', '-At'], input=sql, text=True)
    return json.loads(raw)


def main():
    if os.environ.get('SUPABASE_SERVICE_ROLE_KEY'):
        raise RuntimeError('Service-role credentials must be absent')
    app = local_url(os.environ['FACTORY_LOCAL_APP_ORIGIN'])
    database = local_url(os.environ['FACTORY_LOCAL_SUPABASE_ORIGIN'])
    token = os.environ['FACTORY_LOCAL_ANON_KEY']
    run_id = uuid.uuid4().hex
    email = f'factory-{run_id}@example.test'
    results = []
    assert database_rows(email) == [], 'Disposable database must start empty'
    for payload in ({}, {'email': 'bad'}, {'email': 12}):
        status, _ = request(app + '/api/waitlist', 'POST', payload)
        assert status == 400, f'Invalid input returned {status}'
    results.append('invalid-input-400')
    status, _ = request(app + '/api/waitlist', 'POST', {'email': '  ' + email.upper() + '  '})
    assert status == 201, f'Valid signup returned {status}'
    results.append('actual-api-insert-201')
    status, _ = request(app + '/api/waitlist', 'POST', {'email': email})
    assert status == 409, f'Normalized duplicate returned {status}'
    results.append('normalized-duplicate-409')
    expected = [{'email': email, 'name': None, 'referral_source': None}]
    assert database_rows(email) == expected, 'One normalized durable row expected'
    results.append('independent-sql-single-normalized-row')
    headers = {'apikey': token, 'Authorization': 'Bearer ' + token}
    query = urllib.parse.urlencode({'email': 'eq.' + email, 'select': 'email'})
    status, body = request(database + '/rest/v1/waitlist?' + query, headers=headers)
    assert status == 200 and body == [], 'Anonymous read was not an empty filtered result'
    results.append('anonymous-read-no-disclosure')
    for method, payload in [('PATCH', {'name': 'unauthorized-change'}), ('DELETE', None)]:
        status, body = request(database + '/rest/v1/waitlist?' + query, method, payload,
                               {**headers, 'Prefer': 'return=representation'})
        assert (status in (200, 204) and body in ([], None)) or status in (401, 403), 'Unexpected anonymous write result'
        assert database_rows(email) == expected, 'Anonymous write changed durable data'
        results.append('anonymous-' + method.lower() + '-no-mutation')
    print(json.dumps({'status': 'pass', 'synthetic_email': email, 'checks': results,
                      'scope': 'Actual local HTTP API and anonymous RLS with independent disposable-local SQL inspection; no hosted/deployment acceptance.'}))



if __name__ == '__main__':
    main()
