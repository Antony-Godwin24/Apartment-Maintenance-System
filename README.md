# Apartment Maintenance System

A full-stack web application for managing apartment maintenance requests, built with Java Spring Boot and Vanilla JavaScript.

## 🚀 Features

### For Residents
- **User Registration & Login**: Secure account creation and authentication.
- **Submit Requests**: Create maintenance requests for specific apartments.
- **View History**: Track the status of submitted requests.
- **Home Feed**: View all maintenance requests in the building.

### For Admins
- **Apartment Management**: Add new apartments (Unit Number, Floor) to the system.
- **Request Management**: View all requests and confirm their completion.
- **Status Updates**: Mark requests as "COMPLETED" (Confirmed).

## 🛠️ Technology Stack

- **Backend**: Java 17, Spring Boot 3.2.3
- **Database**: MySQL 8.0
- **Security**: Spring Security, JWT (JSON Web Tokens)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Build Tool**: Maven

## ⚙️ Setup & Installation

### Prerequisites
- Java JDK 17 or higher
- Maven
- MySQL Server
- MongoDB (locally installed or via Docker)

### Setup
1.  Clone the repository.
2.  Ensure MongoDB is running on `localhost:27017`.
3.  Update `src/main/resources/application.properties` if your MongoDB configuration differs.
4.  Run `mvn spring-boot:run`.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ApartmentMaintenanceSystem
```

### 2. Database Setup
Create a MySQL database named `Appartment`.
```sql
CREATE DATABASE Appartment;
```

### 3. Environment Configuration
Create a `.env` file in the root directory of the project and add your database credentials and JWT secret.
```properties
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secure_jwt_secret_key_at_least_512_bits_long
```
> **Note**: The `.env` file is excluded from version control for security.

### 4. Run the Application
```bash
mvn spring-boot:run
```
The application will start on `http://localhost:8080`.

## 📖 Usage

1.  **Open the App**: Navigate to `http://localhost:8080`.
2.  **Register**: Create a new account. Select `ROLE_ADMIN` for admin features or `ROLE_RESIDENT` for resident features.
3.  **Login**: Use your credentials to log in.
4.  **Dashboard**:
    *   **Home**: View all requests.
    *   **New Request**: Submit a maintenance issue (Residents).
    *   **Add Apartment**: Add new units (Admins only).

## 🔒 Security
- Passwords are encrypted using BCrypt.
- API endpoints are secured using JWT authentication.
- Sensitive configuration is managed via environment variables.

## 🤝 Contributing
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
"# Apartment-Maintenance-System" 
