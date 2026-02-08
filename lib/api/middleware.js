// API Middleware utilities

export function withErrorHandling(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error',
      });
    }
  };
}

export function withMethods(allowedMethods, handler) {
  return async (req, res) => {
    if (!allowedMethods.includes(req.method)) {
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`,
      });
      return;
    }
    await handler(req, res);
  };
}

export function withAuth(handler) {
  return async (req, res) => {
    // Add authentication logic here
    // For now, we'll pass through
    // In production, verify Firebase auth token
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    // TODO: Verify Firebase token
    // const token = authHeader.split('Bearer ')[1];
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // req.user = decodedToken;

    await handler(req, res);
  };
}

export function compose(...middlewares) {
  return (handler) => {
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc);
    }, handler);
  };
}
