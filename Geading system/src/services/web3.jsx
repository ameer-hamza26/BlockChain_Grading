// import { ethers } from 'ethers';
// import EducationSystemABI from '../contracts/EducationSystem.json';

// const contractAddress = "YOUR_CONTRACT_ADDRESS";
// let provider, signer, contract;

// Mock data for development
let mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', registrationNumber: '22pwbcs0952', isActive: true, wallet: '0x1234...' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'instructor', registrationNumber: 'EMP001', isActive: true, wallet: '0x5678...' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', registrationNumber: 'ADM001', isActive: true, wallet: '0x9abc...' },
  { id: 4, name: 'Majeed', email: 'majeed@example.com', role: 'admin', registrationNumber: 'ADM002', isActive: true, wallet: '0x9abc...' }
];

let mockCourses = [
  { id: 1, code: 'CS101', title: 'Introduction to Computer Science', credits: 3, instructorId: 2 },
  { id: 2, code: 'MATH201', title: 'Advanced Mathematics', credits: 4, instructorId: 2 }
];

let mockGrades = [
  { evaluationCode: 'CS101_QUIZ1', studentName: 'John Doe', type: 'quiz', marks: '8/10', timestamp: Date.now() / 1000, txHash: '0x123...' },
  { evaluationCode: 'CS101_HW1', studentName: 'John Doe', type: 'homework', marks: '9/10', timestamp: Date.now() / 1000, txHash: '0x456...' }
];

// Mock enrollment: courseId -> array of studentIds
let mockEnrollments = {
  1: [1], // John Doe enrolled in CS101
  2: [],
};

export async function initWeb3() {
  // Mock implementation
  console.log('Web3 initialized (mock mode)');
  return true;
}

export async function getCurrentAccount() {
  // Mock implementation
  return '0x1234567890abcdef';
}

// User Management
export async function addUser(name, email, role, password, registrationNumber) {
  // Mock implementation
  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    role,
    registrationNumber,
    isActive: true,
    wallet: `0x${Math.random().toString(16).substr(2, 8)}...`
  };
  mockUsers.push(newUser);
  console.log('User added:', newUser);
}

export async function getUsers() {
  // Mock implementation
  return mockUsers;
}

export async function updatePassword(userId, newPassword) {
  // Mock implementation
  console.log(`Password updated for user ${userId}`);
}

export async function deleteUser(userId) {
  // Mock implementation
  mockUsers = mockUsers.filter(user => user.id !== userId);
  console.log(`User ${userId} deleted`);
}

// Course Management
export async function addCourse(code, title, credits, semester) {
  // Mock implementation
  const newCourse = {
    id: mockCourses.length + 1,
    code,
    title,
    credits,
    instructorId: 2
  };
  mockCourses.push(newCourse);
  console.log('Course added:', newCourse);
}

export async function getCourses() {
  // Mock implementation
  return mockCourses;
}

// Student Functions
export async function getEnrolledCourses(studentId) {
  // Mock implementation
  return mockCourses.filter(course => course.id <= 2); // Return first 2 courses as enrolled
}

export async function generateEvaluationCodes(courseId) {
  // Mock implementation
  const codes = [
    { code: `${courseId}_QUIZ1`, type: 'quiz', isMarked: false },
    { code: `${courseId}_HW1`, type: 'homework', isMarked: false },
    { code: `${courseId}_EXAM1`, type: 'exam', isMarked: false }
  ];
  console.log('Evaluation codes generated:', codes);
  return codes;
}

// Instructor Functions
export async function submitGrade(evaluationCode, marks) {
  // Mock implementation
  const newGrade = {
    evaluationCode,
    studentName: 'John Doe',
    type: evaluationCode.includes('QUIZ') ? 'quiz' : evaluationCode.includes('HW') ? 'homework' : 'exam',
    marks,
    timestamp: Date.now() / 1000,
    txHash: `0x${Math.random().toString(16).substr(2, 8)}...`
  };
  mockGrades.push(newGrade);
  console.log('Grade submitted:', newGrade);
}

export async function getGrades(courseId) {
  // Mock implementation
  return mockGrades.filter(grade => grade.evaluationCode.startsWith(`${courseId}_`));
}

// Return the number of students enrolled in a course (mock)
export async function getStudentCountForCourse(courseId) {
  // For demo, return fixed or random values
  const mockCounts = {
    1: 40,
    2: 0,
  };
  return mockCounts[courseId] ?? Math.floor(Math.random() * 50);
}

export async function getStudentsForCourse(courseId) {
  // Return user objects for students enrolled in the course
  const studentIds = mockEnrollments[courseId] || [];
  return mockUsers.filter(u => studentIds.includes(u.id) && u.role === 'student');
}

export async function enrollStudentInCourse(courseId, studentId) {
  if (!mockEnrollments[courseId]) mockEnrollments[courseId] = [];
  if (!mockEnrollments[courseId].includes(studentId)) {
    mockEnrollments[courseId].push(studentId);
  }
}