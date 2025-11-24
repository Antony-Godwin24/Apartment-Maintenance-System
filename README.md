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
- **Database**: MongoDB
- **Security**: Spring Security, JWT (JSON Web Tokens)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Build Tool**: Maven

## ⚙️ Setup & Installation

### Prerequisites
- Java JDK 17 or higher
- Maven
- MongoDB (locally installed or via Docker)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ApartmentMaintenanceSystem
```

### 2. Database Setup
Ensure MongoDB is running locally on the default port `27017`.
- **Local Installation**: Start the MongoDB service.
- **Docker**: Run `docker run -d -p 27017:27017 mongo`.

The application will automatically create the necessary database (`apartment-maintenance-system`) and collections upon the first run.

### 3. Configuration (Optional)
The application comes with a default JWT secret for development convenience. However, for better security or to customize the secret:

**Option A: Environment Variable (Recommended)**
Create a `.env` file in the root directory:
```properties
JWT_SECRET=your_secure_jwt_secret_key_at_least_512_bits_long
```

**Option B: Application Properties**
Edit `src/main/resources/application.properties`:
```properties
app.jwtSecret=your_custom_secret_key
```

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
