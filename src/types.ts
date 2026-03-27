export type UserRole = 'student' | 'faculty' | 'dept_admin' | 'visitor' | 'admin';

export interface User {
  id: string; // number-la irundhu string-ku maathiyaachu
  email: string;
  role: UserRole;
  name: string;
  department_id: string; // Idhaiyum string-aa maathuvathu best
  department_name?: string;
  year?: number;
  section?: string;
}

export interface Department {
  id: string;
  name: string;
  location: string;
  image_url?: string;
}

export interface Block {
  id: string;
  name: string;
  type: string;
  image_url?: string;
}

export interface Classroom {
  id: string;
  block_id: string;
  name: string;
  capacity: number;
  block_name?: string;
}

export interface TimetableEntry {
  id: string;
  department_id: string;
  faculty_id: string;
  classroom_id: string;
  day: string;
  start_time: string;
  end_time: string;
  subject: string;
  year: number;
  section: string;
  classroom_name?: string;
  faculty_name?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  timetable_id: string;
  date: string;
  status: 'present' | 'absent';
  subject?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  department_name: string;
  department_id?: string;
  year: number;
  section: string;
  attendance_percentage?: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department_id: string;
  credits: number;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department_name: string;
  block_name?: string;
  type?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_role: UserRole;
  created_at: string;
  updated_at: string;
}