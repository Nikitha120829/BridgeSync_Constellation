export function notFound(_req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'The requested resource was not found.' } });
}

export function errorHandler(error, _req, res, _next) {
  if (process.env.NODE_ENV !== 'production') {
    const location = error?.stack?.split('\n').find((line) => line.includes(' at '))?.trim() ?? '';
    const diagnostic = [error?.name, error?.code ? `code=${error.code}` : '', error?.path ? `path=${error.path}` : '', error?.kind ? `kind=${error.kind}` : '', location].filter(Boolean).join(' ');
    process.stderr.write(`[BridgeSync API] ${diagnostic}\n`);
  }
  if (Number.isInteger(error?.status) && error.status >= 400 && error.status < 500) {
    return res.status(error.status).json({ error: { code: error.code ?? 'REQUEST_REJECTED', message: error.message } });
  }
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ error: { code: 'REQUEST_TOO_LARGE', message: 'Request is too large.' } });
  }
  if (error?.name === 'ValidationError' || error?.name === 'ZodError') {
    return res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Check the submitted fields.' } });
  }
  if (!res.headersSent) {
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'The request could not be completed.' } });
  }
  return undefined;
}
