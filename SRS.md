# Frontend Software Requirements Specification (SRS)
**Project Name:** Job Portal Application - Frontend
**Version:** 1.0

## 1. Introduction
### 1.1 Purpose
This document provides the requirements and architecture for the Frontend of the Job Portal Application. The frontend serves as the candidate and administrative facing interface, allowing users to browse jobs and administrators to manage postings.

### 1.2 Tech Stack
- **Framework**: React.js
- **Build Tool**: Vite
- **State Management**: Redux Toolkit (RTK Query) for seamless data fetching and caching.
- **Styling**: Vanilla CSS / Pre-defined styles.
- **Deployment**: Vercel.

---

## 2. System Features & Pages

### 2.1 Authentication Subsystem
- **Sign Up Page**: Allows users to register. Determines role purely by the structure of the inputted email.
- **Log In Page**: Authenticates users and stores the received JSON Web Token (JWT) in Redux State / Local Storage to retain sessions.

### 2.2 Candidate Interface
- **Job Feed**: Displays all publicly active jobs retrieved from the backend API.
- **Application Portal**: Allows candidates to click on a job and attach an application request.
- **My Applications**: Shows a historical overview of jobs applied to and their status.

### 2.3 Admin Interface
- **Admin Job Dashboard**: Dedicated view for `@arnifi.com` users to manage their recruitment flow.
- **Job Creation Form**: Captures Company, Position, Location, and Job Type.
- **Job Management**: Allows admins to Delete or Update job specifications.

---

## 3. Communication Capabilities
- **API Base URL**: Configured dynamically via Vercel Environment Variables (`VITE_API_BASE_URL`).
- **Authorization Headers**: RTK Query's `prepareHeaders` automatically injects the JWT token into the `Authorization: Bearer <token>` header on every outgoing protected request to ensure stateless authentication.
