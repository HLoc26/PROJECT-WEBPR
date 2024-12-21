export function isAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

export function isEditor(req, res, next) {
  if (req.session.user?.user_role !== 'editor') {
    return res.status(403).redirect('/403');
  }
  next();
}

export function isWriter(req, res, next) {
  if (req.session.user?.user_role !== 'writer') {
    return res.status(403).redirect('/403');
  }
  next(); 
}

// Nhat Quang - add authentication middleware while preserving the profile route