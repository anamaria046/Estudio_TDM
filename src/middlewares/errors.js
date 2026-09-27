export function notFoundHandler(req, res, next) {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
}

export function errorHandler(err, req, res, next) {
    console.error("Internal Error:", err);
    const status = err.status || 500;
    res.status(status).json({
        error: err.message || "Internal Server Error"
    });
}
