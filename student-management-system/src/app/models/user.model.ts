// Simple data models
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  regNo?: string;
}

export interface Leave {
  _id: string;
  studentId: any;
  reason: string;
  fromDate: string;
  toDate: string;
  status: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  description: string;
  fileUrl?: string;
  createdAt: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  regNo: string;
  isBlocked?: boolean;
}