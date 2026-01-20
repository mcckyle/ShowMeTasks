[![show-me-tasks-ci](https://github.com/kmccol1/ShowMeTasks/actions/workflows/show-me-tasks-ci.yml/badge.svg)](https://github.com/kmccol1/ShowMeTasks/actions/workflows/show-me-tasks-ci.yml)
# ShowMeTasks

ShowMeTasks is a simple, modern task management application built with Java Spring Boot and React. Designed for both individual and collaborative productivity, this secure and scalable platform enables users to manage tasks efficiently with advanced role-based access control and real-time features.

## Key Features

- **User Authentication & Security**:  
  Secure registration and login powered by **JWT (JSON Web Tokens)**, ensuring data integrity and user session security.

- **Task Management**:  
  Create, edit, delete, and organize tasks within multiple task lists, tailored to individual users or shared across teams.

- **Scalable Architecture**:  
  Efficient backend built with **Spring Boot**, ensuring robust performance even with growing user data.

## New & Upcoming Enhancements

- **User Sign-In and Profile Management**:  
  Fully functional user authentication system with improved session handling and profile customization.

- **Multiple To-Do Lists per User**:  
  Users can create and manage multiple task lists independently, facilitating better organization.

- **Task Editing and Prioritization**:  
  Edit tasks seamlessly and prioritize them based on urgency or deadlines.

- **Future Enhancements**:  
  - **Collaborative Task Lists**: Share task lists with other users in real-time.  
  - **Task Reminders**: Set notifications for due dates and important deadlines.  
  - **OAuth Integration**: Enable third-party logins for added convenience.

## Tech Stack

- **Front-End**: React, Material-UI (MUI)  
- **Back-End**: Java Spring Boot, Spring Security  
- **Database**: MariaDB (production), H2 (development)  
- **Authentication**: JWT (JSON Web Tokens)  
- **CI/CD**: GitHub Actions  

## Setup and Installation

Follow these steps to set up and run the ShowMeTasks application locally.

### 1. Prerequisites
Ensure you have the following installed on your system:
- **Java Development Kit (JDK)**: Version 11 or higher.
- **MariaDB**: Installed and running.
- **Node.js and npm**: Recommended version 14.x or higher for Node.js.
- **Gradle**: Included with the project via the Gradle Wrapper.

---

### 2. Clone the Repository
Start by cloning the repository and navigating to the project directory:

```bash
git clone https://github.com/mcckyle/ShowMeTasks.git
cd ShowMeTasks
```

---

### 3. Backend Setup (Spring Boot Application)
1. **Navigate to the `backend` folder**:
   ```bash
   cd backend
   ```

2. **Update Database Configuration**:
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

3. **Start the Backend Server**:
   - Use the Gradle Wrapper to start the Spring Boot application:
     ```bash
     ./gradlew bootRun
     ```
   - The server should start on `http://localhost:8080` by default.

---

### 4. Frontend Setup (React Application)
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

### 5. Verify the Application
1. Open your browser and visit the React frontend: `http://localhost:5173`.
2. Test the backend by interacting with the app or directly accessing API endpoints at `http://localhost:8080`.

---

### 6. Optional: Build for Production
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

We welcome contributions to enhance ShowMeTasks!  
1. Fork the repository.  
2. Create a new branch (`git checkout -b feature-branch`).  
3. Commit your changes and push to GitHub.  
4. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

**ShowMeTasks** is a continuously evolving project. We’re excited to enhance it further, improve productivity features, and set a high standard for web development. Stay tuned for more updates! 🚀
