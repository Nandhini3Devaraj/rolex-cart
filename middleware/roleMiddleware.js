/**
 * Role-Based Access Control (RBAC) Middleware
 * Controls access to routes based on user roles
 */

/**
 * Middleware factory function to create role-based authorization middleware
 * @param {...string} allowedRoles - Roles allowed to access the route
 * @returns {Function} Middleware function
 */
export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is attached to request (should be after authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        userRole: req.user.role,
      });
    }

    next();
  };
};

/**
 * Predefined role combinations for common use cases
 */
export const rolePermissions = {
  // Customer can only view products and place orders
  customer: roleMiddleware('Customer', 'Manager', 'SuperAdmin'),
  
  // Staff can view dashboard and orders
  staff: roleMiddleware('Staff', 'Manager', 'SuperAdmin'),
  
  // Manager can manage orders
  manager: roleMiddleware('Manager', 'SuperAdmin'),
  
  // Only SuperAdmin has full access
  superAdmin: roleMiddleware('SuperAdmin'),
  
  // All authenticated users except customers
  staff_and_above: roleMiddleware('Staff', 'Manager', 'SuperAdmin'),
};

export default roleMiddleware;
