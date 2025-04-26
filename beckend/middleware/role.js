// backend/middleware/role.js
const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
      if (req.userRole !== requiredRole) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;