# Student Leave Management System

A full-stack web application for managing student leave requests with separate dashboards for students and administrators.

## Features

### Student Features
- **Authentication**: Secure login for students
- **Apply Leave**: Submit leave applications with date range and reason
- **My Leaves**: View all leave applications with status tracking
- **Dashboard**: Overview of total leaves and pending requests
- **Notifications**: View important announcements from admin
- **Profile Management**: Update personal information

### Admin Features
- **Authentication**: Secure admin login
- **Leave Management**: Approve or reject student leave requests
- **Student Management**: View all students, block/unblock accounts
- **Notifications**: Create and manage system-wide notifications
- **Dashboard**: Statistics overview (total students, leaves, pending requests)
- **Student Enrollment**: Register new students to the system

## Tech Stack

### Frontend
- **Framework**: Angular 17+ (Standalone Components)
- **Styling**: Bootstrap 5 + Custom CSS
- **Icons**: Bootstrap Icons
- **HTTP Client**: Angular HttpClient
- **Authentication**: JWT Token-based

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **API Architecture**: RESTful API

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Angular CLI (v17 or higher)
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/SenthilkumarNarayanan/student-mangement-fullstack-MEAN.git
cd student-management-fullstack-MEAN
```
## Backend setup
## cd server 
## npm install

# Start the backend server
npm run dev    # For development
# OR
npm start      # For production

# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start Angular development server
ng serve

# Application will run at: http://localhost:4200

# For local MongoDB
mongod

# For MongoDB Atlas
# Use the connection string in .env file

# How to use the website
first need to register Admin then login with admin credential
in admin dashboard can enroll new student admin get response student REGNO
then student can register with REGNO. 


