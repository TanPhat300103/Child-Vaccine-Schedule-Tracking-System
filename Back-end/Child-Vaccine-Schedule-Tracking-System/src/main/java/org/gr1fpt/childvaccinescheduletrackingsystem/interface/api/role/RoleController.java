package org.gr1fpt.childvaccinescheduletrackingsystem.role;

import org.gr1fpt.childvaccinescheduletrackingsystem.application.role.RoleService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.role.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("role")
public class RoleController {
    @Autowired
    RoleService roleService;

    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("findid")
    public Role getRoleById(int id) {
        return roleService.getRoleById(id);
    }

    @PostMapping("create")
    public Role createRole(Role role) {
        return roleService.createRole(role);
    }

    @PostMapping("update")
    public Role updateRole(Role role) {
        return roleService.updateRole(role);
    }

    @DeleteMapping("delete")
    public void deleteRole(int id) {
        roleService.deleteRole(id);
    }

}
