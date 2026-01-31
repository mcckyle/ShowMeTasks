[![show-me-tasks-ci](https://github.com/kmccol1/ShowMeTasks/actions/workflows/show-me-tasks-ci.yml/badge.svg)](https://github.com/kmccol1/ShowMeTasks/actions/workflows/show-me-tasks-ci.yml)
# ShowMeTasks

ShowMeTasks is a simple, modern task management application built with **Java Spring Boot** and **React**. It's designed for individuals and teams to organize tasks efficiently with support for multiple task lists, real-time updates, and role-based access control.

---

## Key Features

- **Secure Authentication**:  
  JWT-powered login and registration to make sure user sessions are safe and data integrity is maintained.

- **Task Management**:  
  Create, edit, delete, and organize tasks across multiple lists, for personal use or shared collaboration.

- **Real-Time Updates**:  
  Tasks and lists reflect changes instantly, keeping your workflow smooth and responsive.

- **Scalable Architecture**:  
  Backend built with **Spring Boot**, ready to handle growing user data efficiently.

---

## Upcoming Enhancements

- **User Profiles & Sign-In Improvements**:  
  Personalized dashboards and enhanced session handling.

- **Multiple To-Do Lists per User**:  
  Organize tasks with multiple independent or shared lists.

- **Task Editing & Prioritization**:  
  Seamless task updates with urgency or deadline prioritization.

- **Future Roadmap**:  
  - Collaborative task lists in real-time
  - Task reminders and notifications
  - OAuth integration for third-party login

---

## Tech Stack

- **Front-End**: React, Custom CSS 
- **Back-End**: Java Spring Boot, Spring Security  
- **Database**: MariaDB (production), H2 (development)  
- **Authentication**: JWT (JSON Web Tokens)  
- **CI/CD**: GitHub Actions  

---

## Quick Setup

### Prerequisites
- **Java 11+ (JDK)**
- **Node.js 14+ & npm**
- **MariaDB (running)**
- **Gradle (via Gradle Wrapper)**

---

### 1. Clone the Repository

```bash
git clone https://github.com/mcckyle/ShowMeTasks.git
cd ShowMeTasks
```

---

### 2. Backend Setup (Spring Boot Application)
1. **Navigate to the `backend` folder**:
   ```bash
   cd backend
   ```

3. **Update Database Configuration**:
   - Locate the `application.properties` file under `src/main/resources/`.
   - Update the following fields with your MariaDB credentials:
     ```properties
     spring.datasource.url=jdbc:mariadb://localhost:3306/your_database_name
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```
   - Add a **JWT Secret Key** for authentication:
     ```properties
     jwt.secret=your_secret_key
     ```

4. **Start the Backend Server**:
   - Use the Gradle Wrapper to start the Spring Boot application:
     ```bash
     ./gradlew bootRun
     ```
   - The server should start on `http://localhost:8080` by default.

---

### 5. Frontend Setup (React Application)
1. **Navigate to the `frontend` folder**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   - Use npm to install the required dependencies:
     ```bash
     npm install
     ```

3. **Start the Development Server**:
   - Start the React app:
     ```bash
     npm run dev
     ```
   - The frontend application will be accessible at `http://localhost:5173`.

---

### 6. Verify the Application
1. Open your browser and visit the React frontend: `http://localhost:5173`.
2. Test the backend by interacting with the app or directly accessing API endpoints at `http://localhost:8080`.

---

### 7. Optional: Build for Production
If you want to build the app for production deployment:

#### Backend:
- Package the backend as a JAR file:
  ```bash
  ./gradlew build
  ```
- The JAR file will be located in `build/libs/`.

#### Frontend:
- Build the React app:
  ```bash
  npm run build
  ```
- The optimized static files will be located in the `build/` directory.

---

### Troubleshooting
- **MariaDB connection issues**:
  Ensure MariaDB is running, and the `application.properties` file has the correct credentials.
- **Port conflicts**:
  If the default ports (`8080` for the backend or `5173` for the frontend) are in use, update the configuration files:
  - Backend: `application.properties` file (`server.port`).
  - Frontend: Use the `PORT` environment variable when starting the React app:
    ```bash
    PORT=3001 npm start```

---
	
## Usage Guide

1. **Register or Log In**: Access your personalized dashboard.
2. **Create & Manage Task Lists**: Add, edit, or delete tasks within dedicated lists.
3. **Secure Your Session**: Always log out after use to maintain session security.

## Project Structure

- **Backend** (`src/main/java`) — RESTful API, business logic, and security configurations.
- **Frontend** (`src`) — React components, state management, and UI logic.
- **Database** — MariaDB (production), H2 (development) for local testing.

## Contribution Guidelines

We welcome contributions!  
1. Fork the repository.  
2. Create a feature branch (`git checkout -b feature-branch`).  
3. Commit and push changes.
4. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

**ShowMeTasks** is actively evolving. We’re excited to enhance it further, improve productivity features, and set a high standard for web development. Stay productive, stay organized! 🚀
