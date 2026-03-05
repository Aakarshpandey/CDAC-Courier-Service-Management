# CDAC-Courier-Service-Management
# 🚚 Courier Service Management  
**A full-stack courier booking and tracking system**

---

## ⭐ Overview  
Courier Service Management is a full-stack application built using **Spring Boot**, **MySQL**, and **React**.  
It allows users to book courier pickups, track delivery status, and enables providers/admins to manage operations.

---

## 🔧 Tech Stack  
**Backend:** Spring Boot, Spring Security (JWT), MySQL, JPA  
**Frontend:** React (Vite), Tailwind CSS, Axios  
**Tools:** Maven, Postman, Git  

---

## 📁 Project Structure  
```
Courier-Service-Management/
│── Backend/     # Spring Boot application
│── Frontend/    # React + Vite application
└── README.md
```

---

## 🚀 How to Run

### Backend
```
cd Backend
mvn clean install
mvn spring-boot:run
```

Update `application.properties`:
```
spring.datasource.url=jdbc:mysql://localhost:3306/courierdb
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```

### Frontend
```
cd Frontend
npm install
npm run dev
```

---

## 🧩 Features  
- User login & registration (JWT Auth)  
- Service catalog (courier types & pricing)  
- Courier booking & scheduling  
- Delivery status tracking  
- Provider dashboard  

---

## 🛠️ Roadmap  
- [ ] Payment integration  
- [ ] Email/SMS notifications  
- [ ] Live parcel tracking  
- [ ] Admin analytics  

---

## 👨‍💻 Developer  
**Aakarsh Pandey — Vipul Bagde — Yuvraj Karekar — Rohit Rathod**

---

> This project is actively being built. More modules and features will be added soon.

