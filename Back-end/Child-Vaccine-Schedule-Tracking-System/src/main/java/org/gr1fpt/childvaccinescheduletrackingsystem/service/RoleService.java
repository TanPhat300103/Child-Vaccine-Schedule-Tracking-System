package org.gr1fpt.childvaccinescheduletrackingsystem.service;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Role;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Role getRoleById(int id) {
        return roleRepository.findById(String.valueOf(id)).orElseThrow(() -> new CustomException("Role Id not found", HttpStatus.BAD_REQUEST));
    }

    public Role createRole(Role role) {
        if(roleRepository.existsById(String.valueOf(role.getRoleId()))){
            throw new CustomException("Role Id " + role.getRoleId() + "is exist", HttpStatus.BAD_REQUEST);
        }
        return roleRepository.save(role);
    }

    public Role updateRole(Role role) {
        if(!roleRepository.existsById(String.valueOf(role.getRoleId()))){
           throw new CustomException("Role Id " + role.getRoleId() + "is exist", HttpStatus.BAD_REQUEST);
        }
        return roleRepository.save(role);
    }

    public void deleteRole(int id) {
        roleRepository.deleteById(String.valueOf(id));
    }
}
