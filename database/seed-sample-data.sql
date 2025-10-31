-- =====================================================
-- CDIL LFA Platform: Sample Data for Testing
-- =====================================================
-- Run this after creating the schema
-- This creates sample users, courses, enrollments, etc.

-- =====================================================
-- 0. CLEAR EXISTING DATA (in correct order to avoid FK constraints)
-- =====================================================
TRUNCATE TABLE
  student_assignment_submissions,
  course_assignments,
  student_lesson_attendance,
  course_enrollments,
  materials,
  lessons,
  modules,
  course_prerequisites,
  course_instructors,
  courses,
  students,
  instructors,
  departments,
  users
RESTART IDENTITY CASCADE;

-- =====================================================
-- 1. SAMPLE USERS
-- =====================================================
-- Password for all users: "password123" (hashed with bcrypt)
-- In production, use proper password hashing!

INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role) VALUES
-- Superadmin
('admin@cdil.edu', '$2b$10$rQZ5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX', 'System', 'Administrator', '+1-876-555-0001', 'superadmin'),

-- Instructors (admins)
('dr.johnson@cdil.edu', '$2b$10$rQZ5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX', 'Maria', 'Johnson', '+1-876-555-0100', 'admin'),
('prof.williams@cdil.edu', '$2b$10$rQZ5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX', 'James', 'Williams', '+1-592-555-0101', 'admin'),
('dr.brown@cdil.edu', '$2b$10$rQZ5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX', 'Sarah', 'Brown', '+1-868-555-0102', 'admin'),

-- Students (users)
('john.doe@student.cdil.edu', '$2b$10$rQZ5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX', 'John', 'Doe', '+1-876-555-0200', 'user'),
('jane.smith@student.cdil.edu', '$2b$10$rQZ5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX', 'Jane', 'Smith', '+1-876-555-0201', 'user'),
('michael.davis@student.cdil.edu', '$2b$10$rQZ5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX', 'Michael', 'Davis', '+1-592-555-0202', 'user'),
('emily.wilson@student.cdil.edu', '$2b$10$rQZ5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX', 'Emily', 'Wilson', '+1-868-555-0203', 'user'),
('david.martinez@student.cdil.edu', '$2b$10$rQZ5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX', 'David', 'Martinez', '+1-876-555-0204', 'user'),
('sophia.anderson@student.cdil.edu', '$2b$10$rQZ5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX.lE9Z8Y6mKjZOrQx5fJ0qX', 'Sophia', 'Anderson', '+1-592-555-0205', 'user');

-- =====================================================
-- 2. INSTRUCTORS (profiles for role='admin')
-- =====================================================
INSERT INTO instructors (user_id, employee_id, department, qualifications, bio, status) VALUES
(2, 'INST-001', 'Longevity Sciences', 'PhD in Molecular Biology, MSc in Gerontology', 'Dr. Johnson specializes in cellular aging and longevity research with over 15 years of experience.', 'active'),
(3, 'INST-002', 'Health & Nutrition', 'MD, PhD in Nutritional Sciences', 'Prof. Williams focuses on evidence-based nutrition and metabolic health optimization.', 'active'),
(4, 'INST-003', 'Regenerative Medicine', 'PhD in Stem Cell Biology, MD', 'Dr. Brown is an expert in regenerative therapies and age-related disease prevention.', 'active');

-- =====================================================
-- 3. STUDENTS (profiles for role='user')
-- =====================================================
INSERT INTO students (user_id, student_number, major, enrollment_date, status) VALUES
(5, 'STU-2024-001', 'Health Science', '2024-01-15', 'active'),
(6, 'STU-2024-002', 'Longevity Studies', '2024-01-15', 'active'),
(7, 'STU-2024-003', 'Nutrition Science', '2024-01-20', 'active'),
(8, 'STU-2024-004', 'Health Science', '2024-01-20', 'active'),
(9, 'STU-2024-005', 'Longevity Studies', '2024-02-01', 'active'),
(10, 'STU-2024-006', 'Regenerative Medicine', '2024-02-01', 'active');

-- =====================================================
-- 4. DEPARTMENTS
-- =====================================================
INSERT INTO departments (name, description, department_head_id, campus) VALUES
('Longevity Sciences', 'Research and education in aging, longevity, and healthspan extension', 1, 'Jamaica'),
('Health & Nutrition', 'Evidence-based nutrition and metabolic health programs', 2, 'Guyana'),
('Regenerative Medicine', 'Advanced therapies in cellular regeneration and age-related disease', 3, 'Trinidad');

-- =====================================================
-- 5. COURSES
-- =====================================================
INSERT INTO courses (
    title, description, course_code, department_id, program,
    start_date, end_date, duration_weeks, status, difficulty_level,
    credit_hours, max_enrollment, current_enrollment, learning_outcomes,
    prerequisites, language, campus, delivery_mode, location, created_by
) VALUES
(
    'Introduction to Longevity Science',
    'Comprehensive introduction to the science of aging, longevity research, and evidence-based interventions for healthspan extension. Covers cellular aging, genetics, nutrition, and lifestyle factors.',
    'LONG-101',
    1,
    'LongevityX Foundation Program',
    '2024-03-01',
    '2024-05-31',
    12,
    'active',
    'beginner',
    3,
    30,
    0,
    'Understand biological mechanisms of aging; Evaluate evidence-based longevity interventions; Apply basic longevity principles to personal health',
    'None',
    'English',
    'Jamaica',
    'hybrid',
    'Kingston Campus & Online',
    2
),
(
    'Nutritional Biochemistry',
    'Advanced study of macronutrients, micronutrients, and their metabolic pathways. Focus on optimizing nutrition for longevity and disease prevention.',
    'NUTR-201',
    2,
    'Health Science Program',
    '2024-03-15',
    '2024-06-15',
    13,
    'active',
    'intermediate',
    4,
    25,
    0,
    'Master biochemical pathways of nutrients; Design evidence-based nutrition plans; Analyze nutritional research studies',
    'Basic Biology, Introduction to Chemistry',
    'English',
    'Guyana',
    'online',
    'Online Only',
    3
),
(
    'Cellular Regeneration & Stem Cell Therapy',
    'Cutting-edge course on regenerative medicine, stem cell biology, and therapeutic applications for age-related conditions.',
    'REGEN-301',
    3,
    'Advanced Regenerative Medicine',
    '2024-04-01',
    '2024-07-01',
    13,
    'draft',
    'advanced',
    5,
    20,
    0,
    'Understand stem cell biology and differentiation; Evaluate regenerative therapy protocols; Assess ethical considerations in regenerative medicine',
    'Cell Biology, Molecular Biology',
    'English',
    'Trinidad',
    'in_person',
    'Port of Spain Medical Center',
    4
);

-- =====================================================
-- 6. COURSE INSTRUCTORS
-- =====================================================
INSERT INTO course_instructors (course_id, instructor_id, role) VALUES
(1, 1, 'primary'),      -- Dr. Johnson teaching Longevity Science
(1, 2, 'secondary'),    -- Prof. Williams as secondary instructor
(2, 2, 'primary'),      -- Prof. Williams teaching Nutrition
(3, 3, 'primary');      -- Dr. Brown teaching Regenerative Medicine

-- =====================================================
-- 7. MODULES (for Course 1: Introduction to Longevity Science)
-- =====================================================
INSERT INTO modules (course_id, title, description, order_index, status, estimated_duration_hours) VALUES
(1, 'Fundamentals of Aging Biology', 'Introduction to cellular and molecular mechanisms of aging, including telomeres, mitochondria, and cellular senescence.', 1, 'published', 8),
(1, 'Genetics and Epigenetics of Longevity', 'Explore genetic factors influencing lifespan, epigenetic modifications, and gene expression changes with age.', 2, 'published', 10),
(1, 'Nutrition and Metabolic Health', 'Evidence-based nutritional strategies for longevity including caloric restriction, intermittent fasting, and nutrient timing.', 3, 'published', 12),
(1, 'Exercise and Physical Optimization', 'Role of physical activity, resistance training, and cardiovascular fitness in healthspan extension.', 4, 'draft', 10),

-- Modules for Course 2: Nutritional Biochemistry
(2, 'Macronutrients and Energy Metabolism', 'In-depth study of carbohydrates, proteins, and fats, and their roles in cellular energy production and metabolic pathways.', 1, 'published', 10),
(2, 'Micronutrients and Cellular Function', 'Essential vitamins, minerals, and their biochemical roles in cellular health, disease prevention, and longevity.', 2, 'published', 8),
(2, 'Nutritional Genomics', 'How nutrients interact with genes to influence health outcomes, gene expression, and disease risk across the lifespan.', 3, 'published', 12),
(2, 'Applied Clinical Nutrition', 'Practical application of nutritional biochemistry in disease prevention, management, and optimization of metabolic health.', 4, 'published', 10),

-- Modules for Course 3: Cellular Regeneration & Stem Cell Therapy
(3, 'Stem Cell Biology Fundamentals', 'Introduction to stem cell types, properties, self-renewal mechanisms, and differentiation pathways in regenerative medicine.', 1, 'published', 12),
(3, 'Regenerative Medicine Applications', 'Clinical applications of stem cells in treating age-related diseases, tissue repair, and organ regeneration.', 2, 'published', 10),
(3, 'Tissue Engineering and Biomaterials', 'Principles of creating functional tissues using stem cells, scaffolds, and biomaterials for therapeutic applications.', 3, 'draft', 14),
(3, 'Ethics and Future of Regenerative Medicine', 'Ethical considerations, regulatory frameworks, and emerging trends in stem cell research and regenerative therapies.', 4, 'draft', 8);

-- =====================================================
-- 8. LESSONS (for Module 1: Fundamentals of Aging Biology)
-- =====================================================
INSERT INTO lessons (
    module_id, title, description, content, content_type, lesson_date,
    order_index, status, duration_minutes, learning_objectives, is_live,
    delivery_mode, session_time, meeting_link
) VALUES
(
    1,
    'Welcome & Course Overview',
    'Introduction to the course structure, expectations, and overview of longevity science.',
    'Welcome to Introduction to Longevity Science! This course will explore the cutting-edge science of aging and evidence-based strategies for extending healthspan.',
    'video',
    '2024-03-01',
    1,
    'published',
    60,
    'Understand course structure; Define key concepts in longevity science; Set personal learning goals',
    TRUE,
    'hybrid',
    '10:00:00',
    'https://meet.cdil.edu/longevity-101-week1'
),
(
    1,
    'Cellular Aging: Telomeres and DNA Damage',
    'Deep dive into telomere biology, DNA damage accumulation, and their role in cellular aging.',
    'Telomeres are protective caps at the ends of chromosomes that shorten with each cell division. Understanding telomere biology is crucial to understanding aging.',
    'text',
    '2024-03-04',
    2,
    'published',
    90,
    'Explain telomere structure and function; Describe DNA damage mechanisms; Analyze telomere research studies',
    FALSE,
    'online',
    NULL,
    NULL
),
(
    1,
    'Mitochondrial Function and Energy Metabolism',
    'Explore mitochondrial dysfunction in aging and strategies for maintaining mitochondrial health.',
    'Mitochondria are the powerhouses of the cell. Mitochondrial dysfunction is a hallmark of aging and contributes to many age-related diseases.',
    'interactive',
    '2024-03-08',
    3,
    'published',
    120,
    'Describe mitochondrial structure and function; Explain mitochondrial dysfunction in aging; Evaluate interventions for mitochondrial health',
    TRUE,
    'hybrid',
    '10:00:00',
    'https://meet.cdil.edu/longevity-101-week2'
);

-- =====================================================
-- 9. MATERIALS
-- =====================================================
INSERT INTO materials (
    course_id, module_id, lesson_id, material_scope, title, description,
    resource_type, resource_url, format, source, order_index
) VALUES
-- Course-level materials
(1, NULL, NULL, 'course', 'Course Syllabus', 'Complete course syllabus with schedule and grading policy', 'pdf', 'https://drive.google.com/syllabus-long101.pdf', 'PDF', 'CDIL Course Materials', 1),
(1, NULL, NULL, 'course', 'Recommended Reading List', 'Curated list of books and research papers on longevity', 'pdf', 'https://drive.google.com/reading-list-long101.pdf', 'PDF', 'CDIL Course Materials', 2),

-- Module-level materials
(1, 1, NULL, 'module', 'Aging Biology Overview Video', 'Comprehensive video overview of aging biology fundamentals', 'video', 'https://youtube.com/watch?v=aging-biology-intro', 'MP4', 'YouTube', 1),
(1, 1, NULL, 'module', 'Hallmarks of Aging Research Paper', 'Seminal paper on the hallmarks of aging by López-Otín et al.', 'pdf', 'https://drive.google.com/hallmarks-of-aging.pdf', 'PDF', 'Nature Reviews', 2),

-- Lesson-level materials
(1, 1, 1, 'lesson', 'Welcome Presentation Slides', 'Introduction slides for first class', 'pdf', 'https://drive.google.com/lesson1-slides.pdf', 'PDF', 'CDIL', 1),
(1, 1, 2, 'lesson', 'Telomere Biology Lecture Notes', 'Detailed notes on telomere structure and function', 'pdf', 'https://drive.google.com/telomere-notes.pdf', 'PDF', 'CDIL', 1),
(1, 1, 2, 'lesson', 'Telomere Research Animation', 'Visual animation showing telomere shortening', 'video', 'https://youtube.com/watch?v=telomere-animation', 'MP4', 'YouTube', 2),
(1, 1, 3, 'lesson', 'Mitochondria Interactive Diagram', 'Interactive 3D diagram of mitochondrial structure', 'link', 'https://interactive.cdil.edu/mitochondria-3d', 'HTML5', 'CDIL Interactive', 1);

-- =====================================================
-- 10. COURSE ENROLLMENTS
-- =====================================================
INSERT INTO course_enrollments (course_id, student_id, enrollment_date, status) VALUES
(1, 1, '2024-02-15 10:00:00', 'active'),  -- John Doe in Longevity Science
(1, 2, '2024-02-15 10:15:00', 'active'),  -- Jane Smith in Longevity Science
(1, 3, '2024-02-16 09:30:00', 'active'),  -- Michael Davis in Longevity Science
(1, 4, '2024-02-16 14:20:00', 'active'),  -- Emily Wilson in Longevity Science
(2, 3, '2024-02-20 11:00:00', 'active'),  -- Michael Davis in Nutrition
(2, 5, '2024-02-20 11:30:00', 'active'),  -- David Martinez in Nutrition
(2, 6, '2024-02-20 16:45:00', 'active');  -- Sophia Anderson in Nutrition

-- Update current_enrollment count
UPDATE courses SET current_enrollment = 4 WHERE id = 1;
UPDATE courses SET current_enrollment = 3 WHERE id = 2;

-- =====================================================
-- 11. STUDENT LESSON ATTENDANCE
-- =====================================================
INSERT INTO student_lesson_attendance (student_id, lesson_id, course_id, attendance_status, marked_by) VALUES
-- Lesson 1 attendance (Welcome & Course Overview)
(1, 1, 1, 'present', 2),
(2, 1, 1, 'present', 2),
(3, 1, 1, 'late', 2),
(4, 1, 1, 'present', 2),

-- Lesson 2 attendance (Telomeres) - asynchronous, so marked when completed
(1, 2, 1, 'present', 2),
(2, 2, 1, 'present', 2),
(3, 2, 1, 'absent', 2),

-- Lesson 3 attendance (Mitochondria) - live session
(1, 3, 1, 'present', 2),
(2, 3, 1, 'present', 2),
(4, 3, 1, 'present', 2);

-- =====================================================
-- 12. COURSE ASSIGNMENTS
-- =====================================================
INSERT INTO course_assignments (
    course_id, lesson_id, title, description, assignment_type,
    due_date, max_points, submission_type, allow_resubmission, created_by
) VALUES
(
    1,
    2,
    'Telomere Biology Essay',
    'Write a 1000-word essay explaining the role of telomeres in cellular aging and discuss at least 3 evidence-based interventions that may affect telomere length.',
    'essay',
    '2024-03-11 23:59:00',
    100,
    'text',
    TRUE,
    2
),
(
    1,
    3,
    'Mitochondrial Health Quiz',
    'Multiple choice quiz covering mitochondrial structure, function, and age-related dysfunction.',
    'quiz',
    '2024-03-13 23:59:00',
    50,
    'multiple_choice',
    FALSE,
    2
),
(
    2,
    NULL,
    'Nutrition Plan Design Project',
    'Design a comprehensive evidence-based nutrition plan for longevity. Include macronutrient targets, meal timing, and supplementation recommendations with scientific justification.',
    'project',
    '2024-04-15 23:59:00',
    150,
    'file_upload',
    TRUE,
    3
);

-- =====================================================
-- 13. STUDENT ASSIGNMENT SUBMISSIONS
-- =====================================================
INSERT INTO student_assignment_submissions (
    assignment_id, student_id, submission_content, submitted_at,
    status, grade, feedback, graded_at, graded_by
) VALUES
(
    1,
    1,
    'Telomeres are repetitive nucleotide sequences found at the ends of chromosomes that protect genetic information during cell division. Each time a cell divides, telomeres shorten due to the end-replication problem... [Essay content continues]',
    '2024-03-10 15:30:00',
    'graded',
    92,
    'Excellent analysis of telomere biology. Strong understanding of the mechanisms. Could improve discussion of lifestyle interventions with more recent research citations.',
    '2024-03-12 10:00:00',
    2
),
(
    1,
    2,
    'The role of telomeres in cellular aging is fundamental to understanding longevity science. Telomeres serve as protective caps... [Essay content continues]',
    '2024-03-11 20:15:00',
    'graded',
    88,
    'Good work overall. Clear explanation of telomere function. Need more depth in the discussion of interventions and their mechanisms.',
    '2024-03-12 10:30:00',
    2
),
(
    1,
    3,
    NULL,
    '2024-03-14 22:00:00',
    'submitted',
    NULL,
    NULL,
    NULL,
    NULL
),
(
    2,
    1,
    NULL,
    '2024-03-12 18:45:00',
    'graded',
    48,
    'Strong performance. Minor confusion on Complex IV function.',
    '2024-03-13 09:00:00',
    2
),
(
    2,
    2,
    NULL,
    '2024-03-13 21:30:00',
    'graded',
    45,
    'Good understanding of basic concepts. Review mitochondrial biogenesis pathways.',
    '2024-03-14 09:00:00',
    2
);

-- =====================================================
-- 14. COURSE PREREQUISITES
-- =====================================================
-- Nutritional Biochemistry requires Introduction to Longevity Science
INSERT INTO course_prerequisites (course_id, prerequisite_course_id, is_required) VALUES
(2, 1, FALSE),  -- NUTR-201 recommends LONG-101 but not required
(3, 1, TRUE);   -- REGEN-301 requires LONG-101

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Uncomment these to verify data was inserted correctly

-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_students FROM students;
-- SELECT COUNT(*) as total_instructors FROM instructors;
-- SELECT COUNT(*) as total_courses FROM courses;
-- SELECT COUNT(*) as total_enrollments FROM course_enrollments;
-- SELECT * FROM v_active_courses_with_enrollment;
-- SELECT * FROM v_student_course_progress;
-- SELECT * FROM v_course_statistics;