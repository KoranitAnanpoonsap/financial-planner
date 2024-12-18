package com.finplanner.repository;

import com.finplanner.model.AdminInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminInfoRepository extends JpaRepository<AdminInfo, String> {
    Optional<AdminInfo> findByAdminEmailAndAdminPassword(String email, String password);
}
