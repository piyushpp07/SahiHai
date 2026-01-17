import { Router } from 'express';
import { handleLogin, handleRegister, handleLogout, getMe } from '../controllers/authController';

const router = Router();

router.post('/login', handleLogin);
router.post('/register', handleRegister);
router.post('/logout', handleLogout);
router.get('/me', getMe);

export default router;
