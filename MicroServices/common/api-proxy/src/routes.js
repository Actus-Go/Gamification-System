require('dotenv').config();

const POINTS_SERVICE_PORT = process.env.POINTS_SERVICE_PORT || 8082;

const simpleRequestLogger = (proxyServer, options) => {
    proxyServer.on('proxyReq', (proxyReq, req, res) => {
        if (req.user) {
            console.log(req.user);
            // Convert req.user to JSON and attach it to the request body
            const bodyData = JSON.stringify({ ...req.body, user: req.user });

            // Update the 'Content-Type' and 'Content-Length' headers
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));

            // Write the modified body back to the proxy request
            proxyReq.write(bodyData);
        }
    });
};

module.exports = (app, createProxyMiddleware) => {
    app.use('/points', createProxyMiddleware({
        target: `http://localhost:${POINTS_SERVICE_PORT}`,
        changeOrigin: true,
        plugins: [simpleRequestLogger]
    }));
};


