CREATE DATABASE VaccineManagement;
GO
USE VaccineManagement;
GO

-- Tạo bảng Role
CREATE TABLE Role (
    RoleId INT PRIMARY KEY IDENTITY(1,1),
    RoleName VARCHAR(255) NOT NULL
);

-- Tạo bảng Customer
CREATE TABLE Customer (
    customerId VARCHAR(255) PRIMARY KEY,
    phoneNumber VARCHAR(255),
    firstName NVARCHAR(255),
    lastName NVARCHAR(255),
    dob DATE,
    gender BIT,
    password VARCHAR(255),
    address NVARCHAR(255),
    banking NVARCHAR(255),
    email VARCHAR(255),
    roleId INT,
    FOREIGN KEY (roleId) REFERENCES Role(RoleId)
);

-- Tạo bảng Staff
CREATE TABLE Staff (
    staffId NVARCHAR(255) PRIMARY KEY,
    firstName NVARCHAR(255),
    lastName NVARCHAR(255),
    phone VARCHAR(255),
    dob DATE,
    mail VARCHAR(255),
    gender BIT,
    password NVARCHAR(255),
    roleId INT,
    FOREIGN KEY (roleId) REFERENCES Role(RoleId)
);

-- Tạo bảng Admin
CREATE TABLE Admin (
    id INT PRIMARY KEY IDENTITY(1,1),
    firstName NVARCHAR(255),
    lastName NVARCHAR(255),
    phone VARCHAR(255),
    pass VARCHAR(255),
    mail VARCHAR(255),
    roleId INT,
    FOREIGN KEY (roleId) REFERENCES Role(RoleId)
);

-- Tạo bảng Child
CREATE TABLE Child (
    childId VARCHAR(255) PRIMARY KEY,
    firstName NVARCHAR(255),
    lastName NVARCHAR(255),
    gender BIT,
    customerId VARCHAR(255),
    contraindications VARCHAR(255),
    dob DATE,
    FOREIGN KEY (customerId) REFERENCES Customer(customerId)
);

-- Tạo bảng Vaccine
CREATE TABLE Vaccine (
    vaccineId VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    doseNumber INT,
    price MONEY,
    description NVARCHAR(255),
    country NVARCHAR(255),
    ageMin INT,
    ageMax INT
);

-- Tạo bảng MedicalHistory
CREATE TABLE MedicalHistory (
    medicalHistoryId VARCHAR(255) PRIMARY KEY,
    childId VARCHAR(255),
    vaccineId VARCHAR(255),
    date DATE,
    dose INT,
    reaction NVARCHAR(255),
    FOREIGN KEY (childId) REFERENCES Child(childId),
    FOREIGN KEY (vaccineId) REFERENCES Vaccine(vaccineId)
);

-- Tạo bảng Booking
CREATE TABLE Booking (
    bookingId VARCHAR(255) PRIMARY KEY,
    bookingDate DATE,
    customerId VARCHAR(255),
    status INT,
    totalAmount INT,
    FOREIGN KEY (customerId) REFERENCES Customer(customerId)
);

-- Tạo bảng Feedback
CREATE TABLE Feedback (
    id INT PRIMARY KEY IDENTITY(1,1),
    bookingId VARCHAR(255),
    ranking INT,
    comment NVARCHAR(255),
    FOREIGN KEY (bookingId) REFERENCES Booking(bookingId)
);

-- Tạo bảng BookingDetail
CREATE TABLE BookingDetail (
    bookingDetailId VARCHAR(255) PRIMARY KEY,
    bookingId VARCHAR(255),
    childId VARCHAR(255),
    scheduledDate DATETIME,
    administeredDate DATETIME,
    vaccineId VARCHAR(255),
    reactionNote NVARCHAR(255),
    vaccineComboId VARCHAR(255),
    status INT,
    FOREIGN KEY (bookingId) REFERENCES Booking(bookingId),
    FOREIGN KEY (childId) REFERENCES Child(childId),
    FOREIGN KEY (vaccineId) REFERENCES Vaccine(vaccineId)
);

-- Tạo bảng VaccineCombo
CREATE TABLE VaccineCombo (
    vaccineComboId VARCHAR(255) PRIMARY KEY,
    name NVARCHAR(255),
    description NVARCHAR(255)
);

-- Tạo bảng ComboDetail
CREATE TABLE ComboDetail (
    comboDetailId VARCHAR(255) PRIMARY KEY,
    vaccineComboId VARCHAR(255),
    vaccineId VARCHAR(255),
    FOREIGN KEY (vaccineComboId) REFERENCES VaccineCombo(vaccineComboId),
    FOREIGN KEY (vaccineId) REFERENCES Vaccine(vaccineId)
);

-- Tạo bảng VaccineDetail
CREATE TABLE VaccineDetail (
    id INT PRIMARY KEY IDENTITY(1,1),
    entryDate DATE,
    expiredDate DATE,
    status BIT,
    vaccineId VARCHAR(255),
    img VARCHAR(255),
    day INT,
    tolerance INT,
    FOREIGN KEY (vaccineId) REFERENCES Vaccine(vaccineId)
);

-- Tạo bảng Payment
CREATE TABLE Payment (
    paymentId VARCHAR(255) PRIMARY KEY,
    bookingId VARCHAR(255),
    date DATETIME,
    total INT,
    method BIT,
    status BIT,
    transactionId VARCHAR(255),
    coupon VARCHAR(255),
    FOREIGN KEY (bookingId) REFERENCES Booking(bookingId)
);

-- Tạo bảng MarketingCampaign
CREATE TABLE MarketingCampaign (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255),
    startTime DATE,
    endTime DATE,
    coupon VARCHAR(255),
    discount INT,
    description NVARCHAR(255)
);
