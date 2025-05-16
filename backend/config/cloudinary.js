const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Force https
});

// Create storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'todoits',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx'],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return file.fieldname + '-' + uniqueSuffix;
    }
  }
});

// Initialize multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only pdf files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  }
});

// Test the Cloudinary connection
cloudinary.api.ping()
  .then(result => console.log('Cloudinary connection successful:', result))
  .catch(error => console.error('Cloudinary connection failed:', error));

module.exports = { cloudinary, upload };