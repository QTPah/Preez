export const checkPermission = (requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions || [];

    if (Array.isArray(requiredPermissions)) {
      if (requiredPermissions.some(permission => userPermissions.includes(permission))) {
        return next();
      }
    } else if (userPermissions.includes(requiredPermissions)) {
      return next();
    }

    return res.status(403).json({ success: false, message: 'Permission denied' });
  };
};
