const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

try {
    mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
}
catch (error) {
    console.log(error);
}


// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { ...decoded, id: decoded.userId }; 
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Protected route example
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
});

// Get All Members Route
app.get('/api/members', authMiddleware, async (req, res) => {
    try {
        const members = await User.find({}, { password: 0, resetPasswordToken: 0, resetPasswordExpires: 0 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Add this after the User schema
const taskAssignmentSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add this line
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    priority: String,
    category: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const TaskAssignment = mongoose.model('TaskAssignment', taskAssignmentSchema);


// Add this after your existing schemas
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    priority: { type: String, default: 'medium' },
    category: String,
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending' },
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }], // Add this line
    documentUrl: [{ type: String }] ,// Add this line to store PDF URLs
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// Add this after your existing routes
// Create Task Route
app.post('/api/tasks', authMiddleware, async (req, res) => {
    try {
        const { title, description, dueDate, priority, assignedTo, category, status, documentUrl } = req.body;

        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            category,
            status,
            assignedTo, // This should be an array of user IDs
            assignedBy: req.user.id,
            documentUrl // Include documentUrl here
        });

        const savedTask = await task.save();

        // Create task assignments for each assigned user
        if (assignedTo && assignedTo.length > 0) {
            const taskAssignments = assignedTo.map(userId => ({
                taskId: savedTask._id,
                assignedTo: userId,
                assignedBy: req.user.id,
                title,
                description,
                dueDate,
                priority,
                category,
                status
            }));

            await TaskAssignment.insertMany(taskAssignments);
        }

        // Populate the assigned users' details in the response
        const populatedTask = await Task.findById(savedTask._id)
            .populate('assignedTo', 'firstName lastName email')
            .populate('assignedBy', 'firstName lastName email');

        res.status(201).json(populatedTask);
    } catch (error) {
        console.error('Task creation error:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
});

// Get Tasks Route
app.get('/api/tasks', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({
            $or: [
                { assignedTo: req.user.id },
                { assignedBy: req.user.id }
            ]
        })
        .populate('assignedTo', 'firstName lastName email')
        .populate('assignedBy', 'firstName lastName email')
        .sort({ createdAt: -1 });

        res.json(tasks); // documentUrl should be included in each task object here
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});


// Update the tasks/assigned route
app.get('/api/tasks/assigned', authMiddleware, async (req, res) => {
    try {
        const assignments = await TaskAssignment.find({ assignedTo: req.user.id })
            .populate('assignedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });

        // Format the response to include assigner information
        const formattedAssignments = assignments.map(assignment => ({
            ...assignment.toObject(),
            assignerName: assignment.assignedBy ? 
                `${assignment.assignedBy.firstName} ${assignment.assignedBy.lastName}` : 
                'Unknown',
            assignerEmail: assignment.assignedBy ? assignment.assignedBy.email : ''
        }));

        res.json(formattedAssignments);
    } catch (error) {
        console.error('Error fetching assigned tasks:', error);
        res.status(500).json({ message: 'Error fetching assigned tasks' });
    }
});

// Add route to update task status
// Update the task status route to update both TaskAssignment and main Task status
app.patch('/api/tasks/assigned/:id', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        
        // Find and update the assignment
        const assignment = await TaskAssignment.findOneAndUpdate(
            { _id: req.params.id, assignedTo: req.user.id },
            { status },
            { new: true }
        );
        
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        if (assignment.taskId) {
            if (status === 'completed') {
                const allAssignments = await TaskAssignment.find({ taskId: assignment.taskId });
                
                const completedAssignments = await TaskAssignment.find({ 
                    taskId: assignment.taskId, 
                    status: 'completed' 
                });
                
                if (allAssignments.length === completedAssignments.length) {
                    await Task.findByIdAndUpdate(
                        assignment.taskId,
                        { status: 'completed' }
                    );
                } else {
                    await Task.findByIdAndUpdate(
                        assignment.taskId,
                        { status: 'in-progress' }
                    );
                }
            } else if (status === 'in-progress') {
                await Task.findByIdAndUpdate(
                    assignment.taskId,
                    { status: 'in-progress' }
                );
            } else if (status === 'pending') {
                const nonPendingAssignments = await TaskAssignment.find({
                    taskId: assignment.taskId,
                    status: { $ne: 'pending' }
                });
                
                if (nonPendingAssignments.length === 0) {
                    await Task.findByIdAndUpdate(
                        assignment.taskId,
                        { status: 'pending' }
                    );
                }
            }
        }
        
        res.json(assignment);
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ message: 'Error updating task status' });
    }
});

// Add a new route to delete completed tasks
app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, assignedBy: req.user.id });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await TaskAssignment.deleteMany({ taskId: task._id });
        await Task.deleteOne({ _id: task._id });
        res.json({ message: 'Task and all assignments deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task' });
    }
});





// Add this with your other routes
app.get('/api/user/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id, { password: 0, resetPasswordToken: 0, resetPasswordExpires: 0 });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});
// Get All Tasks Route
app.get('/api/tasks', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Update Task Status Route
app.patch('/api/tasks/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;
    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true, runValidators: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating task' });
  }
});
// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Forgot Password - Send OTP
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = generateOTP();
        // Store OTP with email (expires in 10 minutes)
        otpStore.set(email, {
            otp,
            expiry: Date.now() + 600000 // 10 minutes
        });

        // Send email with OTP
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. This OTP will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
    try {
        const { email, otp } = req.body;
        const storedOTPData = otpStore.get(email);

        if (!storedOTPData) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        if (Date.now() > storedOTPData.expiry) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (storedOTPData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error in OTP verification:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password with OTP
app.post('/api/reset-password-otp', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const storedOTPData = otpStore.get(email);

        if (!storedOTPData) {
            return res.status(400).json({ message: 'OTP verification required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        // Clear OTP
        otpStore.delete(email);

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in password reset:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const { cloudinary, upload } = require('./config/cloudinary');

// Add document schema
const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  fileType: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  createdAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);

// File upload route
app.post('/api/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { taskId, title } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'todoits',
      use_filename: true,
      unique_filename: true
    });

    // Create new document
    const document = new Document({
      title: title || req.file.originalname,
      url: result.secure_url,
      fileType: req.file.mimetype,
      uploadedBy: req.user.id,
      taskId: taskId
    });

    const savedDocument = await document.save();

    // Update task with the document reference
    if (taskId) {
      await Task.findByIdAndUpdate(
        taskId,
        { $push: { documents: savedDocument._id } }
      );
    }

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      document: savedDocument
    });
  } catch (error) {
    console.error('Upload error details:', error);
    res.status(500).json({ 
      message: 'Error uploading file',
      error: error.message
    });
  }
});

// Get documents for a task
app.get('/api/tasks/:taskId/documents', authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({ taskId: req.params.taskId })
      .populate('uploadedBy', 'firstName lastName email');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

// Delete document
app.delete('/api/documents/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Extract public_id from the Cloudinary URL
    const publicId = document.url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);
    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document' });
  }
});

// Add Meeting Schema
const meetingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    attendees: [String], // Array of email addresses
    location: String,
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Meeting = mongoose.model('Meeting', meetingSchema);

// Create Meeting Route
app.post('/api/meetings', authMiddleware, async (req, res) => {
    try {
        const { title, description, startTime, endTime, attendees, location } = req.body;
        
        const meeting = new Meeting({
            title,
            description,
            startTime,
            endTime,
            attendees,
            location,
            organizer: req.user.id
        });

        const savedMeeting = await meeting.save();
        res.status(201).json(savedMeeting);
    } catch (error) {
        res.status(500).json({ message: 'Error creating meeting', error: error.message });
    }
});

// Get All Meetings Route
app.get('/api/meetings/all', authMiddleware, async (req, res) => {
    try {
        const meetings = await Meeting.find()
            .populate('organizer', 'firstName lastName email')
            .sort({ startTime: 1 });
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching meetings', error: error.message });
    }
});

// Update Meeting Route
app.put('/api/meetings/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, startTime, endTime, attendees, location } = req.body;
        
        // Find meeting and verify organizer
        const meeting = await Meeting.findOne({
            _id: req.params.id,
            organizer: req.user.id
        });

        if (!meeting) {
            return res.status(404).json({ 
                message: 'Meeting not found or you are not authorized to update this meeting' 
            });
        }

        // Update meeting
        const updatedMeeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                startTime,
                endTime,
                attendees,
                location
            },
            { new: true }
        ).populate('organizer', 'firstName lastName email');

        res.json(updatedMeeting);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating meeting', 
            error: error.message 
        });
    }
});

// Delete Meeting Route
app.delete('/api/meetings/:id', authMiddleware, async (req, res) => {
    try {
        // Find meeting and verify organizer
        const meeting = await Meeting.findOne({
            _id: req.params.id,
            organizer: req.user.id
        });

        if (!meeting) {
            return res.status(404).json({ 
                message: 'Meeting not found or you are not authorized to delete this meeting' 
            });
        }

        // Delete the meeting
        await Meeting.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting meeting', 
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

