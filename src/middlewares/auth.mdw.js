export function isAuth(req, res, next) {
  // console.log('Session Data:', req.session);
  if (!req.session.user) {
    return res.redirect('/login');
  }
  // req.user = req.session.user;
  // console.log('Authenticated User:', req.user);
  next();
}

export function isEditor(req, res, next) {
  if (req.session.user?.user_role !== 'editor') {
    return res.status(403).redirect('/404');  // Changed from /403 to /404 (will be reconsidered)
  }
  next();
}

export function isWriter(req, res, next) {
  if (req.session.user?.user_role !== 'writer') {
    return res.status(403).redirect('/404');  // Changed from /403 to /404 (will be reconsidered)
  }
  next(); 
}

// Nhat Quang - add authentication middleware while preserving the profile route
