package com.neobank.backend.Controller;


import com.neobank.backend.DTO.UserResponseDTO;
import com.neobank.backend.Model.Transaction;
import com.neobank.backend.Service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ✅ Get total balance in the system
    @GetMapping("/total-balance")
    public BigDecimal getTotalBalance() {
        return adminService.getTotalBalance();
    }

    // ✅ Get user statistics (active, frozen, deleted)
    @GetMapping("/user-stats")
    public Map<String, Long> getUserStats() {
        return adminService.getUserStats();
    }

    // ✅ Get last X transactions (default 10)
    @GetMapping("/recent-transactions")
    public List<Transaction> getRecentTransactions(@RequestParam(defaultValue = "10") int limit) {
        return adminService.getRecentTransactions(limit);
    }
}
