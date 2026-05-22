import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ============================================================================
// 1. UPLOAD LOGO PARPOL
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/parpol';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadLogo = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Hanya file gambar yang diperbolehkan!'));
  }
});

// ============================================================================
// 2. UPLOAD HEADER / TEMPLATES
// ============================================================================
const storageHeader = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/templates'; 
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'header-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadHeader = multer({ 
  storage: storageHeader,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Hanya file gambar yang diperbolehkan!'));
  }
});

// ============================================================================
// 3. UPLOAD FOTO CALON
// ============================================================================
const storageCalon = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/calon';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'calon-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadFotoCalon = multer({ 
  storage: storageCalon,
  limits: { fileSize: 2 * 1024 * 1024 } // Max 2MB
});

// ============================================================================
// 4. [DIPERBARUI] UPLOAD PUSTAKA MEDIA (GAMBAR, VIDEO, DOKUMEN)
// ============================================================================
const storageMedia = multer.diskStorage({
  destination: (req, file, cb) => {
    // UBAH INI KEMBALI KE 'posts' AGAR COCOK DENGAN RESPONSE URL CONTROLLER
    const dir = './uploads/posts'; 
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'media-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadPostImage = multer({ 
  storage: storageMedia,
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedDocs = [
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain', 'text/csv'
    ];

    if (
      file.mimetype.startsWith('image/') || 
      file.mimetype.startsWith('video/') || 
      allowedDocs.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Tipe file tidak didukung! Hanya Gambar, Video, PDF, Word, Excel, dan PPT yang diperbolehkan.'));
    }
  }
});