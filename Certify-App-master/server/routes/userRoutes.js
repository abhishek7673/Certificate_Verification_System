import express from 'express';
import { checkUser, fetchProfilePic, fetchResume, getUserProfile, login, logout, register, updateProfile, updateProfilePic, updateResume } from '../controllers/userController.js';
import { protect } from '../middlewares/protect.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB limit
});

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check-user', checkUser);
router.get('/profile', protect, getUserProfile);
router.get('/resume',protect, fetchResume);
router.get('/profile-pic',protect, fetchProfilePic);

router.put('/profile', protect, updateProfile);
router.put('/resume', protect, upload.single('resume'), updateResume);
router.put('/profile-pic', protect, upload.single('profilePic'), updateProfilePic);

export default router;