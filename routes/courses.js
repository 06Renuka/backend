

const express = require('express');
const router = express.Router();

const mockCourses = [
    { title: '(New) Responsive Web Design Certification', duration: '300 hours', imageUrl: 'path/to/responsive_web_design.jpg' },
    { title: 'Legacy Responsive Web Design Certification', duration: '300 hours', imageUrl: 'path/to/legacy_responsive_web_design.jpg' },
    { title: 'JavaScript Algorithms and Data Structures Certification', duration: '300 hours', imageUrl: 'path/to/javascript_algorithms.jpg' },
    { title: 'Front End Development Libraries Certification', duration: '300 hours', imageUrl: 'path/to/front_end_libraries.jpg' },
    { title: 'Data Visualization Certification', duration: '300 hours', imageUrl: 'path/to/data_visualization.jpg' },
    { title: 'Back End Development and APIs Certification', duration: '300 hours', imageUrl: 'path/to/backend_apis.jpg' },
    { title: 'Quality Assurance Certification', duration: '300 hours', imageUrl: 'path/to/quality_assurance.jpg' }
];

router.get('/api/courses', (req, res) => {
    res.json(mockCourses);
});

module.exports = router;

