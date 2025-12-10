# User Management System

![Project Status](https://img.shields.io/badge/Status-Completed-success?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

> A full-stack web application for user authentication and administrative management. Built with **React** and **Node.js**, featuring robust security mechanisms and a responsive UI styled with **Tailwind CSS**.

---

## Live Demo

| Component | Status | Link |
|-----------|--------|------|
| **Frontend** | Online | [Open App on Vercel](https://user-management-app-itransition.vercel.app/) |
| **Backend** | Online | [API on Render](https://user-management-backend-c6r6.onrender.com/) |

> *Note: Since the backend is hosted on Render (Free Tier), the first request might take 30-60 seconds to wake up the server.*

---

## Screenshots

*(Вставь сюда ссылку на скриншот, например из папки assets, или удали эту строку, если скриншота пока нет)*
`![App Dashboard](./client/src/assets/preview.png)`

---

## Key Features

This project demonstrates core Full-Stack capabilities, focusing on security and state management:

*   **Authentication:** Secure Registration and Login flow.
*   **User Management:**
    *   **Block/Unblock:** Instantly revoke access. Blocked users are forcefully logged out.
    *   **Delete:** Permanent removal of user accounts.
    *   **Bulk Actions:** Select multiple users to update their status simultaneously.
*   **Security:** Route protection (Protected Routes) and session validation.
*   **Responsive Design:** Fully adaptive UI built with Tailwind CSS.

---

## Tech Stack

### **Frontend**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

<div align="center">
<sub>Built with ❤️ during iTransition Internship</sub>
</div>
---

## Installation & Setup

To run this project locally, follow these steps:


### 1. Clone the repository
```bash
git clone https://github.com/maribukh/user-management-app_itransition.git
cd user-management-app_itransition

cd server
npm install

cd ../client
npm install
npm run dev


