package com.example.backend.controller;

import com.example.backend.model.Ticket;
import com.example.backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        try {
            return ResponseEntity.ok(ticketService.updateTicket(id, ticket));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            String cleanStatus = status.replace("\"", "").trim();
            return ResponseEntity.ok(ticketService.updateStatus(id, cleanStatus));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public java.util.Map<String, Long> getStats() {
        return java.util.Map.of(
            "total", ticketService.getTotalTicketCount(),
            "open", ticketService.getOpenTicketCount(),
            "inProgress", ticketService.getInProgressTicketCount(),
            "resolved", ticketService.getResolvedTicketCount()
        );
    }

    @GetMapping("/filter")
    public List<Ticket> filterTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String department) {
        if (status != null) return ticketService.getTicketsByStatus(status);
        if (category != null) return ticketService.getTicketsByCategory(category);
        if (priority != null) return ticketService.getTicketsByPriority(priority);
        if (department != null) return ticketService.getTicketsByDepartment(department);
        return ticketService.getAllTickets();
    }
}