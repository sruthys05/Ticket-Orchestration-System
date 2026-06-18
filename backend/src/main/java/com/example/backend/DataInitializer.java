package com.example.backend;

import com.example.backend.model.Ticket;
import com.example.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private TicketRepository ticketRepository;

    @Override
    public void run(String... args) {
        if (ticketRepository.count() == 0) {
            // Open tickets
            Ticket t1 = new Ticket();
            t1.setTitle("Email server down");
            t1.setDescription("Unable to send or receive emails since 9 AM. Outlook shows connection error.");
            t1.setCategory("Software");
            t1.setPriority("Critical");
            t1.setStatus("Open");
            t1.setDepartment("IT");
            t1.setEmployeeName("John Smith");
            t1.setEmployeeEmail("john@company.com");
            t1.setCreatedDate(LocalDateTime.now().minusHours(3));
            ticketRepository.save(t1);

            Ticket t2 = new Ticket();
            t2.setTitle("New laptop setup");
            t2.setDescription("Need to configure new Dell laptop for new employee - Sarah Wilson. Install VS Code, Docker, and corporate tools.");
            t2.setCategory("Hardware");
            t2.setPriority("Medium");
            t2.setStatus("Open");
            t2.setDepartment("Engineering");
            t2.setEmployeeName("Mike Chen");
            t2.setEmployeeEmail("mike@company.com");
            t2.setCreatedDate(LocalDateTime.now().minusDays(1));
            ticketRepository.save(t2);

            Ticket t3 = new Ticket();
            t3.setTitle("VPN connection issues");
            t3.setDescription("Cannot connect to VPN from home office. Works fine on office network. Error: Connection timeout.");
            t3.setCategory("Network");
            t3.setPriority("High");
            t3.setStatus("Open");
            t3.setDepartment("Finance");
            t3.setEmployeeName("Alice Johnson");
            t3.setEmployeeEmail("alice@company.com");
            t3.setCreatedDate(LocalDateTime.now().minusHours(5));
            ticketRepository.save(t3);

            // In Progress tickets
            Ticket t4 = new Ticket();
            t4.setTitle("Printer not working");
            t4.setDescription("Floor 3 printer showing error 0x610000. Paper jam cleared but still not working.");
            t4.setCategory("Hardware");
            t4.setPriority("Medium");
            t4.setStatus("In Progress");
            t4.setDepartment("Operations");
            t4.setEmployeeName("David Lee");
            t4.setEmployeeEmail("david@company.com");
            t4.setAssignedTo("IT Support Team");
            t4.setCreatedDate(LocalDateTime.now().minusDays(2));
            ticketRepository.save(t4);

            Ticket t5 = new Ticket();
            t5.setTitle("Database access request");
            t5.setDescription("Need read-only access to production database for quarterly reporting. Database: prod_db_01.");
            t5.setCategory("Access");
            t5.setPriority("High");
            t5.setStatus("In Progress");
            t5.setDepartment("Analytics");
            t5.setEmployeeName("Emily Davis");
            t5.setEmployeeEmail("emily@company.com");
            t5.setAssignedTo("DBA Team");
            t5.setCreatedDate(LocalDateTime.now().minusDays(1).minusHours(4));
            ticketRepository.save(t5);

            // Resolved tickets
            Ticket t6 = new Ticket();
            t6.setTitle("Slack integration broken");
            t6.setDescription("GitHub notifications not posting to #dev channel. Was working yesterday.");
            t6.setCategory("Software");
            t6.setPriority("Low");
            t6.setStatus("Resolved");
            t6.setDepartment("Engineering");
            t6.setEmployeeName("Sarah Wilson");
            t6.setEmployeeEmail("sarah@company.com");
            t6.setAssignedTo("DevOps Team");
            t6.setResolution("Re-authenticated Slack-GitHub integration. Webhook URL was expired, regenerated and updated.");
            t6.setCreatedDate(LocalDateTime.now().minusDays(3));
            t6.setUpdatedDate(LocalDateTime.now().minusDays(1));
            ticketRepository.save(t6);

            Ticket t7 = new Ticket();
            t7.setTitle("Keyboard replacement");
            t7.setDescription("Mechanical keyboard has faulty 'Enter' key. Requesting replacement.");
            t7.setCategory("Hardware");
            t7.setPriority("Low");
            t7.setStatus("Resolved");
            t7.setDepartment("HR");
            t7.setEmployeeName("Tom Brown");
            t7.setEmployeeEmail("tom@company.com");
            t7.setAssignedTo("IT Support Team");
            t7.setResolution("Replaced with new Logitech keyboard. Old keyboard sent for RMA.");
            t7.setCreatedDate(LocalDateTime.now().minusDays(5));
            t7.setUpdatedDate(LocalDateTime.now().minusDays(2));
            ticketRepository.save(t7);

            System.out.println("===== Sample tickets initialized for Ticket Orchestration System =====");
        }
    }
}