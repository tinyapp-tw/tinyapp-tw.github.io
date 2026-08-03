# 本機開發伺服器 — 修正 Windows 上 .js/.webmanifest 的 MIME type
# 用法: python serve.py [port]
import sys
import http.server
import socketserver

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8123

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.js': 'text/javascript',
        '.mjs': 'text/javascript',
        '.webmanifest': 'application/manifest+json',
        '.json': 'application/json',
        '.html': 'text/html; charset=utf-8',
    }

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')  # 開發時不快取，改檔即生效
        super().end_headers()

with socketserver.TCPServer(('127.0.0.1', PORT), Handler) as httpd:
    print(f'Serving at http://127.0.0.1:{PORT}')
    httpd.serve_forever()
