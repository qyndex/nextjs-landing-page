"""Disposable test-only Docker transport: explicit loopback bindings for this namespace.
It never changes global Docker configuration and lives only while CLI start runs.
"""
from pathlib import Path
import http.client
import http.server
import json
import os
import socket
import socketserver
import subprocess
import threading
import urllib.parse

ROOT = Path('/private/tmp/factory-db-verification-20261019')
SOCKET = ROOT / 'docker-loopback.sock'
PROJECT = 'factory-db-20261019'


def constrain(path, body):
    if not path.split('?', 1)[0].endswith('/containers/create'):
        return body
    name = urllib.parse.parse_qs(urllib.parse.urlsplit(path).query).get('name', [''])[0]
    if name and (not name.startswith('supabase_') or not name.endswith('_' + PROJECT)):
        raise ValueError('Container creation outside the disposable project refused')
    value = json.loads(body)
    labels = value.get('Labels') or {}
    if labels.get('com.supabase.cli.project') != PROJECT:
        raise ValueError('Disposable project label missing')
    host = value.get('HostConfig', {})
    if host.get('NetworkMode') != PROJECT + '-loopback':
        raise ValueError('Disposable network required')
    for bindings in (host.get('PortBindings') or {}).values():
        for binding in bindings or []:
            binding['HostIp'] = '127.0.0.1'
    return json.dumps(value).encode()


class UnixConnection(http.client.HTTPConnection):
    def connect(self):
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.sock.settimeout(120)
        self.sock.connect(os.environ['FACTORY_DOCKER_SOCKET'])


class Handler(http.server.BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.0'
    def log_message(self, *args):
        pass
    def handle_request(self):
        connection = None
        try:
            if self.headers.get('Transfer-Encoding'):
                self.send_error(400, 'Chunked input is not supported'); return
            body = self.rfile.read(int(self.headers.get('Content-Length', '0')))
            body = constrain(self.path, body)
            headers = {k: v for k, v in self.headers.items()
                       if k.lower() not in ('host', 'connection', 'content-length')}
            headers['Content-Length'] = str(len(body))
            headers['Connection'] = 'close'
            connection = UnixConnection('localhost')
            connection.request(self.command, self.path, body, headers)
            response = connection.getresponse()
            self.send_response(response.status)
            for key, value in response.getheaders():
                if key.lower() not in ('transfer-encoding', 'connection'):
                    self.send_header(key, value)
            self.send_header('Connection', 'close'); self.end_headers()
            while chunk := response.read1(65536):
                self.wfile.write(chunk); self.wfile.flush()
        except ValueError:
            self.send_error(403, 'Disposable namespace guard refused request')
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            if connection:
                connection.close()
    do_GET = do_POST = do_DELETE = do_PUT = do_HEAD = handle_request


class Server(socketserver.ThreadingMixIn, socketserver.UnixStreamServer):
    daemon_threads = True


def main():
    if SOCKET.exists():
        raise RuntimeError('Unexpected existing test socket')
    server = Server(str(SOCKET), Handler); os.chmod(SOCKET, 0o600)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    env = {k: v for k, v in os.environ.items() if k in ('PATH','HOME','USER','TMPDIR')}
    env['DOCKER_HOST'] = 'unix://' + str(SOCKET)
    env['SUPABASE_TELEMETRY_DISABLED'] = 'true'
    try:
        with (ROOT / 'start-explicit-loopback.log').open('w') as log:
            result = subprocess.run(['supabase','start','--workdir',str(ROOT/'stack'),
                    '--network-id',PROJECT+'-loopback','--exclude',
                    'realtime,storage-api,imgproxy,mailpit,postgres-meta,studio,edge-runtime,logflare,vector,supavisor'],
                    env=env, stdout=log, stderr=subprocess.STDOUT)
        print('Explicit-loopback startup exit:', result.returncode)
        return result.returncode
    finally:
        server.shutdown(); server.server_close(); SOCKET.unlink(missing_ok=True)


if __name__ == '__main__':
    raise SystemExit(main())
