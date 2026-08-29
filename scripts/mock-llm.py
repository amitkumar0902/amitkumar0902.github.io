#!/usr/bin/env python3
"""Tiny OpenAI-compatible mock for testing amit.agent locally — no keys, no network.

    python3 scripts/mock-llm.py            # http://127.0.0.1:8765
    python3 -m http.server 4321            # serve the site from the repo root
    open http://localhost:4321/?endpoint=http://127.0.0.1:8765

It streams a canned HTML reply (SSE, `choices[0].delta.content`) that echoes the
question and how many CONTEXT chunks it received, so you can see retrieval and
streaming work end-to-end.  model == "bad-model" → 404 shaped like OpenRouter's,
to exercise the error/fallback path.
"""
import json, re, sys, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765


class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, ngrok-skip-browser-warning')

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()

    def do_GET(self):
        body = json.dumps({'ok': True, 'mock': True}).encode()
        self.send_response(200); self._cors()
        self.send_header('Content-Type', 'application/json'); self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        n = int(self.headers.get('Content-Length') or 0)
        try:
            payload = json.loads(self.rfile.read(n) or b'{}')
        except Exception:
            payload = {}
        model = payload.get('model', '')
        msgs = payload.get('messages', [])
        last = next((m.get('content', '') for m in reversed(msgs) if m.get('role') == 'user'), '')
        q = last.split('USER QUESTION:')[-1].strip().splitlines()
        q = next((l for l in q if l and not l.startswith('[')), '(none)')
        chunks = len(re.findall(r'^\[#\d+ · ', last, flags=re.M))

        if model == 'bad-model':
            body = json.dumps({'error': {'message': f'No endpoints found for {model}.', 'code': 404}}).encode()
            self.send_response(404); self._cors()
            self.send_header('Content-Type', 'application/json'); self.end_headers()
            self.wfile.write(body); return

        reply = (f'<p>Mock backend online. I got <b>{len(msgs)}</b> messages and '
                 f'<b>{chunks}</b> retrieved context chunks for the question '
                 f'<i>{q[:120]}</i>.</p><ul><li>model: {model}</li><li>stream: {payload.get("stream")}</li>'
                 f'<li>Replace me with the Worker URL or an ngrok endpoint.</li></ul>')

        if payload.get('stream') is False:
            body = json.dumps({'id': 'mock', 'object': 'chat.completion', 'model': model,
                               'choices': [{'index': 0, 'message': {'role': 'assistant', 'content': reply},
                                            'finish_reason': 'stop'}]}).encode()
            self.send_response(200); self._cors()
            self.send_header('Content-Type', 'application/json'); self.end_headers()
            self.wfile.write(body); return

        self.send_response(200); self._cors()
        self.send_header('Content-Type', 'text/event-stream'); self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(b': MOCK PROCESSING\n\n'); self.wfile.flush()
        for tok in re.findall(r'<[^>]+>|\S+\s*', reply):
            evt = {'id': 'mock', 'object': 'chat.completion.chunk', 'model': model,
                   'choices': [{'index': 0, 'delta': {'content': tok}, 'finish_reason': None}]}
            self.wfile.write(f'data: {json.dumps(evt)}\n\n'.encode()); self.wfile.flush()
            time.sleep(0.02)
        self.wfile.write(b'data: [DONE]\n\n'); self.wfile.flush()

    def log_message(self, fmt, *args):
        sys.stderr.write('mock-llm: ' + fmt % args + '\n')


if __name__ == '__main__':
    print(f'mock-llm listening on http://127.0.0.1:{PORT}/v1/chat/completions')
    ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
