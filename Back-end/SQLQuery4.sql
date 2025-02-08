
-- Cập nhật DB 1.1
-- Thêm trường active
-- Thêm quantity vào vaccine detail
-- Sửa tên cột role

-- Thêm cột active vào các bảng cần thiết
ALTER TABLE Customer ADD active BIT DEFAULT 1;
ALTER TABLE Staff ADD active BIT DEFAULT 1;
ALTER TABLE Admin ADD active BIT DEFAULT 1;
ALTER TABLE Vaccine ADD active BIT DEFAULT 1;
ALTER TABLE VaccineCombo ADD active BIT DEFAULT 1;
ALTER TABLE MarketingCampaign ADD active BIT DEFAULT 1;

--Thêm quantity vào vaxindetail
ALTER TABLE VaccineDetail ADD quantity INT DEFAULT 0;

-- Đổi tên cột RoleName thành roleName trong bảng Role
EXEC sp_rename 'Role.RoleName', 'roleName', 'COLUMN';

-- Đổi tên cột roleId thành RoleId trong bảng Customer
EXEC sp_rename 'Customer.roleId', 'roleId', 'COLUMN';

-- Đổi tên cột roleId thành RoleId trong bảng Admin
EXEC sp_rename 'Admin.roleId', 'roleId', 'COLUMN';

-- Đổi tên cột roleId thành RoleId trong bảng Staff
EXEC sp_rename 'Staff.roleId', 'roleId', 'COLUMN';

