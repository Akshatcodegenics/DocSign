const Audit = require('../models/Audit');

const auditLog = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const auditData = {
          documentId: req.params.id || req.body.documentId,
          userId: req.user?._id,
          action: action,
          details: `${req.method} ${req.originalUrl}`,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          metadata: {
            body: req.body,
            params: req.params,
            query: req.query,
          },
        };

        // Only log if we have a documentId
        if (auditData.documentId) {
          Audit.create(auditData).catch(err => {
            console.error('Audit logging error:', err);
          });
        }
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = auditLog;
