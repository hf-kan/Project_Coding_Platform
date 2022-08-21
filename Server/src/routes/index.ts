import express from 'express';

const router = express.Router();

router.get('/', (req: any, res: any, _next: any) => {
  res.render('index', {
    title: 'Microsoft Authentication for UoB Coding Platform',
    isAuthenticated: req.session.isAuthenticated,
    username: req.session.account?.username,
  });
});

export default router;
