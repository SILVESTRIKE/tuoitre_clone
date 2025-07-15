const authorizeMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if the user's role is in the allowed roles
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

//     // If roles is a string, convert it to an array
//     if (typeof roles === 'string') {
//         roles = [roles];
//     }

//     return (req, res, next) => {
//         // Check if the user is authenticated
//         if (!req.isAuthenticated()) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         // Check if the user's role is in the allowed roles
//         if (roles.length && !roles.includes(req.user.role)) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         next();
//     };
// }
module.exports = authorizeMiddleware;