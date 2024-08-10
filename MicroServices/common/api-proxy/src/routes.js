
module.exports = (app, createProxyMiddleware) => {
    app.use('/', createProxyMiddleware({target: ''}))
};