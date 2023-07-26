import passport from 'passport';
import express from 'express';
export const sessionsRouter = express.Router();

sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  
  req.session.email = req.user.email;
  req.session.password = req.user.password;
  req.session.first_name = req.user.first_name;
  req.session.last_name = req.user.last_name;
  req.session.age = req.user.age;
  req.session.rol = req.user.rol;
  
  res.redirect('/products');
}); 

sessionsRouter.get('/show', (req, res) => {
  return res.send(JSON.stringify(req.session));
});

sessionsRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("error", { error: "no se pudo cerrar la sesion" });
    }
    return res.redirect("/api/sessions/login");
  });
});
