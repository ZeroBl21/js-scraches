import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = "."

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Intenta servir el archivo solicitado
        if not os.path.exists(self.translate_path(self.path)):
            # Si el archivo no existe, redirige a index.html
            self.path = "/index.html"
        return super().do_GET()

# Configura el servidor
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Serving on port {PORT}")
    httpd.serve_forever()
