package com.example.backend.service;

import com.example.backend.model.Ticket;
import com.example.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus("Open");
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicket(Long id, Ticket updated) {
        return ticketRepository.findById(id).map(ticket -> {
            if (updated.getTitle() != null) ticket.setTitle(updated.getTitle());
            if (updated.getDescription() != null) ticket.setDescription(updated.getDescription());
            if (updated.getCategory() != null) ticket.setCategory(updated.getCategory());
            if (updated.getPriority() != null) ticket.setPriority(updated.getPriority());
            if (updated.getStatus() != null) ticket.setStatus(updated.getStatus());
            if (updated.getDepartment() != null) ticket.setDepartment(updated.getDepartment());
            if (updated.getEmployeeName() != null) ticket.setEmployeeName(updated.getEmployeeName());
            if (updated.getEmployeeEmail() != null) ticket.setEmployeeEmail(updated.getEmployeeEmail());
            if (updated.getResolution() != null) ticket.setResolution(updated.getResolution());
            if (updated.getAssignedTo() != null) ticket.setAssignedTo(updated.getAssignedTo());
            return ticketRepository.save(ticket);
        }).orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    public Ticket updateStatus(Long id, String status) {
        return ticketRepository.findById(id).map(ticket -> {
            ticket.setStatus(status);
            return ticketRepository.save(ticket);
        }).orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }

    public List<Ticket> getTicketsByStatus(String status) {
        return ticketRepository.findByStatus(status);
    }

    public List<Ticket> getTicketsByCategory(String category) {
        return ticketRepository.findByCategory(category);
    }

    public List<Ticket> getTicketsByPriority(String priority) {
        return ticketRepository.findByPriority(priority);
    }

    public List<Ticket> getTicketsByDepartment(String department) {
        return ticketRepository.findByDepartment(department);
    }

    public long getOpenTicketCount() {
        return ticketRepository.countByStatus("Open");
    }

    public long getInProgressTicketCount() {
        return ticketRepository.countByStatus("In Progress");
    }

    public long getResolvedTicketCount() {
        return ticketRepository.countByStatus("Resolved");
    }

    public long getTotalTicketCount() {
        return ticketRepository.count();
    }
}