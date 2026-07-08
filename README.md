# Ticket Orchestration System

IT issue tracking system where employees can raise tickets for problems they face (email down, printer broken, VPN not working, etc.) and IT staff can track and resolve them.

## Tech Stack
Java 17 + Spring Boot 3.1.1 + MySQL 8.0 + HTML/CSS/JS

## Project Structure
```
Ticket-Management-System-Java/
├── backend/                          # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/backend/
│   │   │   │   ├── BackendApplication.java
│   │   │   │   ├── WebConfig.java
│   │   │   │   ├── DataInitializer.java
│   │   │   │   ├── model/Ticket.java
│   │   │   │   ├── repository/TicketRepository.java
│   │   │   │   ├── service/TicketService.java
│   │   │   │   └── controller/TicketController.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/index.html
│   │   └── test/
│   ├── pom.xml
│   └── mvnw.cmd
└── README.md
```

## How to Run

### Prerequisites
- Java 17 (set JAVA_HOME)
- MySQL 8.0 running on port 3306

### Steps
```powershell
cd backend
.\mvnw.cmd clean package -DskipTests
.\mvnw.cmd spring-boot:run
```

Then open http://localhost:8080

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tickets | List all tickets |
| GET | /api/tickets/{id} | Get ticket by ID |
| POST | /api/tickets | Create new ticket |
| PUT | /api/tickets/{id} | Update ticket |
| PATCH | /api/tickets/{id}/status | Update status |
| DELETE | /api/tickets/{id} | Delete ticket |
| GET | /api/tickets/stats | Dashboard stats |
| GET | /api/tickets/filter?status= | Filter tickets |

### Create a ticket
```bash
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"Email down","description":"Cannot send emails","category":"Software","priority":"High","department":"IT","employeeName":"John","employeeEmail":"john@company.com"}'
```

## 7 Sample Tickets (Auto-Seeded)
- Email server down (Critical/Open)
- New laptop setup (Medium/Open)
- VPN connection issues (High/Open)
- Printer not working (Medium/In Progress)
- Database access request (High/In Progress)
- Slack integration broken (Low/Resolved)
- Keyboard replacement (Low/Resolved)

## Configuration
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ticket_management_system?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update