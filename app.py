"""Offline length-contraction web app. Python standard library only."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
import argparse
import csv
import io
import json
import math
import webbrowser

ROOT = Path(__file__).resolve().parent
C = 299_792_458
MAX_BETA = .999999

def calculate(length, beta):
    length, beta = float(length), float(beta)
    if not math.isfinite(length) or not 0 < length <= 1e12:
        raise ValueError('Enter a proper length greater than 0 and no more than 10¹² m.')
    if not math.isfinite(beta) or not 0 <= beta <= MAX_BETA:
        raise ValueError('Enter a speed from 0 to 0.999999c. A massive rod cannot reach c.')
    ratio = math.sqrt((1-beta)*(1+beta))
    # Avoid cancellation in 1 - sqrt(1 - beta²) at low speeds.
    reduction = beta*beta/(1+ratio)
    return dict(proper_length=length, beta=beta, speed_m_s=beta*C,
                length=length*ratio, ratio=ratio, gamma=1/ratio,
                contraction_percent=100*reduction, delta_length=length*reduction)

def curve():
    return [[i/500, calculate(1, i/500)['ratio']] for i in range(500)] + [[MAX_BETA,calculate(1,MAX_BETA)['ratio']]]

def csv_data(cases):
    if not isinstance(cases,list) or not 1 <= len(cases) <= 100:
        raise ValueError('Record between 1 and 100 measurements before exporting.')
    output=io.StringIO(newline='')
    fields=['proper_length','beta','speed_m_s','gamma','length','delta_length','contraction_percent']
    writer=csv.DictWriter(output,fieldnames=fields,extrasaction='ignore')
    writer.writerow(dict(zip(fields,['L0_m','v_over_c','v_m_s','gamma','L_m','delta_L_m','contraction_percent'])))
    for case in cases:
        writer.writerow(calculate(case['proper_length'],case['beta']))
    return output.getvalue().encode('utf-8')

class Handler(BaseHTTPRequestHandler):
    def send(self,status,body,content_type='application/json; charset=utf-8'):
        self.send_response(status)
        self.send_header('Content-Type',content_type)
        self.send_header('Content-Length',str(len(body)))
        self.send_header('Cache-Control','no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        route=urlsplit(self.path)
        try:
            if route.path == '/api/calculate':
                query=parse_qs(route.query)
                result=calculate(query.get('length',['100'])[0],query.get('beta',['0.8'])[0])
                self.send(200,json.dumps(result,allow_nan=False).encode())
            elif route.path == '/api/curve':
                self.send(200,json.dumps(curve(),allow_nan=False).encode())
            elif route.path in {'/','/index.html','/styles.css','/app.js'}:
                filename='index.html' if route.path=='/' else route.path[1:]
                mime={'html':'text/html','css':'text/css','js':'text/javascript'}[filename.split('.')[-1]]
                self.send(200,(ROOT/filename).read_bytes(),mime+'; charset=utf-8')
            elif route.path == '/favicon.ico':
                self.send(204,b'')
            else:
                self.send(404,b'{"error":"Not found"}')
        except (ValueError,TypeError,KeyError) as exc:
            self.send(400,json.dumps({'error':str(exc)}).encode())

    def do_POST(self):
        try:
            if self.path != '/api/export':
                self.send(404,b'{"error":"Not found"}'); return
            size=int(self.headers.get('Content-Length','0'))
            if not 0 < size <= 65536: raise ValueError('Invalid export size.')
            cases=json.loads(self.rfile.read(size))
            self.send(200,csv_data(cases),'text/csv; charset=utf-8')
        except (ValueError,TypeError,KeyError) as exc:
            self.send(400,json.dumps({'error':str(exc)}).encode())

    def log_message(self,format,*args):
        pass

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port',type=int,default=8765)
    parser.add_argument('--open',action='store_true',help='Open the app in the default browser')
    args=parser.parse_args()
    try:
        server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
    except OSError as exc:
        parser.exit(1,f'Cannot start server: {exc}\nClose another running copy or use --port 8766.\n')
    print(f'Length Contraction Visualiser: http://127.0.0.1:{args.port}',flush=True)
    print('Open this address in Chrome. Keep this terminal open; press Ctrl+C to stop.',flush=True)
    if args.open: webbrowser.open(f'http://127.0.0.1:{args.port}')
    try: server.serve_forever()
    except KeyboardInterrupt: print('\nServer stopped.')
    finally: server.server_close()

if __name__=='__main__': main()
