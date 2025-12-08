# CDAC-Courier-Service-Management
🚚 Courier Service Management (In Development)

A full-stack Courier Service Management Platform aimed at simplifying courier operations through modules like User Management, Service Catalog, Booking & Scheduling, and Provider Dashboard.
Built using Spring Boot, MySQL, and React.

📌 Project Status

🚧 This project is currently in active development.
Features, backend APIs, and frontend UI are continuously being added and refined.

🧩 Core Modules
1. User Management

User Registration & Login

JWT Authentication

Role-based Access (Admin, Provider, Customer)

Profile Management

2. Service Catalog

Courier Service Types

Rate & Pricing Structure

Availability Checks

3. Booking & Scheduling

Create Pickup Request

Schedule Pickup Time

Track Delivery Status

Provider Assignment

4. Provider Dashboard

View Assigned Deliveries

Update Parcel Status

Manage Service Capacity

🛠️ Tech Stack
Backend

Spring Boot

Spring Security (JWT)

Spring Data JPA

MySQL

Frontend

React + Vite

Tailwind CSS

Axios

React Router

Other Tools

Postman

IntelliJ / VS Code

Git & GitHub

📁 Project Structure
Courier-Service-Management/
│
├── Backend/
│   ├── src/main/java/com/courier/...
│   ├── src/main/resources/
│   └── pom.xml
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md

🚀 How to Run the Project
1. Clone the Repository
git clone https://github.com/<your-username>/Courier-Service-Management.git
cd Courier-Service-Management

2. Backend Setup
cd Backend
mvn clean install

Configure MySQL

Update application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/courierdb
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update


Run backend:

mvn spring-boot:run

3. Frontend Setup
cd Frontend
npm install
npm run dev

📌 API Documentation

Swagger integration will be added soon.

🧪 Testing (Planned)

JUnit + Mockito

React Testing Library

🗺️ Roadmap

 Authentication Module

 Service Catalog CRUD

 Booking & Scheduling System

 Provider Dashboard

 Email/SMS Notifications

 Parcel Live Tracking (Phase 2)

 Payment Integration (Phase 2)

🤝 Contributing

Contributions are welcome after the first stable release.

📄 License

To be added in future release.

👨‍💻 Developer

Jim Hopper
Full-Stack Developer (Spring Boot + React)
