const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

// app.use('/api/auth', require("./modules/Auth/authRoutes"));

// app.use('/api/admin/ai', require("./modules/Admin/AIManagement/AIManagementRoutes"));
// app.use('/api/admin/analytics', require("./modules/Admin/Analytics/AnalyticsRoutes"));
// app.use('/api/admin/content-moderation', require("./modules/Admin/ContentModeration/ContentModerationRoutes"));
// app.use('/api/admin/course-management', require("./modules/Admin/CourseManagement/CourseManagementRoutes"));
// app.use('/api/admin/dashboard', require("./modules/Admin/Dashboard/DashboardRoutes"));
// app.use('/api/admin/notifications', require("./modules/Admin/Notifications/NotificationsRoutes"));
// app.use('/api/admin/settings', require("./modules/Admin/Settings/SettingsRoutes"));
// app.use('/api/admin/system', require("./modules/Admin/SystemManagement/SystemManagementRoutes"));
// app.use('/api/admin/user-management', require("./modules/Admin/UserManagement/UserManagementRoutes"));

// app.use('/api/faculty/ai', require("./modules/Faculty/AIAssistant/AIAssistantRoutes"));
// app.use('/api/faculty/analytics', require("./modules/Faculty/Analytics/AnalyticsRoutes"));
// app.use('/api/faculty/assignments', require("./modules/Faculty/Assignments/AssignmentsRoutes"));
// app.use('/api/faculty/content-library', require("./modules/Faculty/ContentLibrary/ContentLibraryRoutes"));
// app.use('/api/faculty/courses', require("./modules/Faculty/Courses/CoursesRoutes"));
// app.use('/api/faculty/dashboard', require("./modules/Faculty/Dashboard/DashboardRoutes"));
// app.use('/api/faculty/live-class', require("./modules/Faculty/LiveClass/LiveClassRoutes"));
// app.use('/api/faculty/messages', require("./modules/Faculty/Messages/MessagesRoutes"));
// app.use('/api/faculty/processing-center', require("./modules/Faculty/ProcessingCenter/ProcessingCenterRoutes"));
// app.use('/api/faculty/record-lecture', require("./modules/Faculty/RecordLecture/RecordLectureRoutes"));
// app.use('/api/faculty/settings', require("./modules/Faculty/Settings/SettingsRoutes"));
// app.use('/api/faculty/students', require("./modules/Faculty/Students/StudentsRoutes"));

app.use('/api/student/notes', require("./modules/Students/AINotes/AINotesRoutes"));
app.use('/api/student/quiz', require("./modules/Students/AIQuiz/AIQuizRoutes"));
app.use('/api/student/tutor', require("./modules/Students/AITutor/AITutorRoutes"));
app.use('/api/student/assignments', require("./modules/Students/Assignments/AssignmentsRoutes"));
app.use('/api/student/courses', require("./modules/Students/Courses/CoursesRoutes"));
// app.use('/api/student/dashboard', require("./modules/Students/Dashboard/DashboardRoutes"));
// app.use('/api/student/lecture-library', require("./modules/Students/LectureLibrary/LectureLibraryRoutes"));
// app.use('/api/student/notifications', require("./modules/Students/Notifications/NotificationsRoutes"));
// app.use('/api/student/profile', require("./modules/Students/Profile/ProfileRoutes"));
// app.use('/api/student/progress', require("./modules/Students/Progress/ProgressRoutes"));


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'System is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Stack Trace:", err.stack);
    res.status(err.status || 500).json({ 
        status: 'error', 
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;