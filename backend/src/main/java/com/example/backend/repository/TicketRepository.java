package com.example.backend.repository;

import com.example.backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByStatus(String status);
    List<Ticket> findByCategory(String category);
    List<Ticket> findByPriority(String priority);
    List<Ticket> findByDepartment(String department);
    List<Ticket> findByEmployeeEmail(String employeeEmail);
    List<Ticket> findByAssignedTo(String assignedTo);
    long countByStatus(String status);
}