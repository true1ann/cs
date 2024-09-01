const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 65069;

const requestHandler = (req, res) => {
    const basePath = __dirname; // Base directory for serving files
    let filePath = path.join(basePath, req.url === '/' ? '' : req.url);

    // If the request is for a directory, list the files
    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>', 'utf-8');
            logRequest(req, 404);
            return;
        }

        if (stats.isDirectory()) {
            // Read the directory and list files
            fs.readdir(filePath, (err, files) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error reading directory: ' + err.code);
                    logRequest(req, 500);
                    return;
                }

                // Create a simple HTML file browser
                let fileList = '<h1>File Browser</h1><ul>';
                files.forEach(file => {
                    const fileUrl = path.join(req.url, file);
                    fileList += `<li><a href="${fileUrl}">${file}</a></li>`;
                });
                fileList += '</ul>';
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(fileList, 'utf-8');
                logRequest(req, 200);
            });
        } else {
            // Serve the file
            const extname = String(path.extname(filePath)).toLowerCase();
            let contentType = 'text/html';
            switch (extname) {
                case '.js':
                    contentType = 'text/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.jpg':
                    contentType = 'image/jpg';
                    break;
                case '.gif':
                    contentType = 'image/gif';
                    break;
                case '.svg':
                    contentType = 'image/svg+xml';
                    break;
                case '.txt':
                    contentType = 'text/plain';
                    break;
                case '.html':
                    contentType = 'text/html';
                    break;
                default:
                    contentType = 'application/octet-stream';
            }

            fs.readFile(filePath, (error, content) => {
                if (error) {
                    res.writeHead(500);
                    res.end('Sorry, there was an error: ' + error.code + ' ..\n');
                    logRequest(req, 500);
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                    logRequest(req, 200);
                }
            });
        }
    });
};

// Function to log requests
const logRequest = (req, statusCode) => {
    const now = new Date();
    const logEntry = `${req.socket.remoteAddress} - - [${now.toUTCString()}] "${req.method} ${req.url} HTTP/${req.httpVersion}" ${statusCode} -`;
    console.log(logEntry);
};

// Create the server
const server = http.createServer(requestHandler);

// Start the server
server.listen(PORT, () => {
    console.log(`Serving at port ${PORT}`);
});
