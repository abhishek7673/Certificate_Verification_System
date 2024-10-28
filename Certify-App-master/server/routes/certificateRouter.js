import express from 'express';
const router = express.Router();
import { fileUpload, generateCertificate } from '../controllers/certificateController.js';

import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the destination directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Specify the filename
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), fileUpload);

// router.put('/resume', protect, upload.single('resume'), updateResume);
// router.put('/profile-pic', protect, upload.single('profilePic'), updateProfilePic);

router.get('/:certificateId', generateCertificate);

export default router;