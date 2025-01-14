-- Bảng Users
CREATE TABLE users (
	user_id INT PRIMARY KEY AUTO_INCREMENT,
	user_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	phone VARCHAR(255),
	pass_word VARCHAR(255),
	user_role VARCHAR(255),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Bảng Movies
CREATE TABLE Movies (
	movie_id INT PRIMARY KEY AUTO_INCREMENT,
	movie_name VARCHAR(255),
	movie_trailer VARCHAR(255),
	movie_image VARCHAR(255),
	description VARCHAR(255),
	release_date DATE,
	rating INT, 
	is_hot BOOLEAN,
	is_showing BOOLEAN,
	is_coming_soon BOOLEAN,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE Movies
ADD COLUMN duration INTEGER DEFAULT 120;


ALTER TABLE Movies
MODIFY COLUMN rating FLOAT;


-- Bảng CinemaSystems (Hệ thống rạp)
CREATE TABLE CinemaSystems (
	system_id INT PRIMARY KEY AUTO_INCREMENT,
	system_name VARCHAR(255),
	logo_url VARCHAR(255),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



-- Bảng CinemaClusters (Cụm rạp)
CREATE TABLE CinemaClusters (
	cluster_id INT PRIMARY KEY AUTO_INCREMENT,
	cluster_name VARCHAR(255),
	cluster_address VARCHAR(255),
	system_id INT,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_cinema_system FOREIGN KEY (system_id) REFERENCES CinemaSystems(system_id)
);


-- Bảng Cinemas (Rạp phim)
CREATE TABLE Cinemas (
	cinema_id INT PRIMARY KEY AUTO_INCREMENT,
	cinema_name VARCHAR(255),
	cluster_id INT,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_cluster FOREIGN KEY (cluster_id) REFERENCES CinemaClusters(cluster_id)
);

ALTER TABLE Cinemas 
ADD COLUMN max_seats INT NOT NULL;

-- Bảng Seats (Chỗ ngồi)
CREATE TABLE Seats (
	seat_id INT PRIMARY KEY AUTO_INCREMENT,
	seat_name VARCHAR(255),
	seat_type VARCHAR(255),
	seat_status BOOLEAN,
	cinema_id INT,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_seat_cinema FOREIGN KEY (cinema_id) REFERENCES Cinemas(cinema_id)
);

ALTER TABLE Seats 
ADD COLUMN is_booked BOOLEAN NOT NULL DEFAULT FALSE;




-- Bảng Schedules (Lịch Chiếu)
CREATE TABLE Schedules (
	schedule_id INT PRIMARY KEY AUTO_INCREMENT,
	cinema_id INT,
	movie_id INT,
	showtime DATE,
	ticket_price INT,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_schedule_cinema FOREIGN KEY (cinema_id) REFERENCES Cinemas(cinema_id),
	CONSTRAINT fk_schedule_movie FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
);
ALTER TABLE Schedules
CHANGE COLUMN showtime show_datetime DATETIME;




-- Bảng Bookings (Đặt vé)
CREATE TABLE Bookings (
	user_id INT,
	schedule_id INT,
	seat_id INT,
	booking_date DATE,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(user_id),
	CONSTRAINT fk_booking_schedule FOREIGN KEY (schedule_id) REFERENCES Schedules(schedule_id),
	CONSTRAINT fk_booking_seat FOREIGN KEY (seat_id) REFERENCES Seats(seat_id),
	PRIMARY KEY (user_id, schedule_id, seat_id)
);

ALTER TABLE Bookings
ADD COLUMN ticket_price FLOAT;


ALTER TABLE Seats DROP COLUMN is_booked;
ALTER TABLE Bookings ADD COLUMN is_booked BOOLEAN DEFAULT FALSE;


-- Bảng Banners
CREATE TABLE Banners (
	banner_id INT PRIMARY KEY AUTO_INCREMENT,
	movie_id INT,
	banner_image VARCHAR(255),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_banner_movie FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
);

CREATE TABLE user_roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


ALTER TABLE users 
DROP COLUMN user_role,
ADD COLUMN role_id INT,
ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES user_roles(role_id);

INSERT INTO user_roles (role_name) VALUES 
('Admin'),
('User');



ALTER TABLE users
ADD COLUMN account VARCHAR(255) NOT NULL ;



ALTER TABLE Seats
DROP COLUMN seat_status

ALTER TABLE Seats 
ADD COLUMN schedule_id INT;

ALTER TABLE Seats
ADD CONSTRAINT fk_seat_schedule FOREIGN KEY (schedule_id) REFERENCES Schedules(schedule_id);

SET time_zone = '+07:00';




-- Trigger cho bảng users
CREATE TRIGGER before_insert_users
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    SET NEW.created_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

CREATE TRIGGER before_update_users
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

-- Trigger cho bảng Movies
CREATE TRIGGER before_insert_movies
BEFORE INSERT ON Movies
FOR EACH ROW
BEGIN
    SET NEW.created_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

CREATE TRIGGER before_update_movies
BEFORE UPDATE ON Movies
FOR EACH ROW
BEGIN
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

-- Trigger cho bảng CinemaSystems
CREATE TRIGGER before_insert_cinemasystems
BEFORE INSERT ON CinemaSystems
FOR EACH ROW
BEGIN
    SET NEW.created_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

CREATE TRIGGER before_update_cinemasystems
BEFORE UPDATE ON CinemaSystems
FOR EACH ROW
BEGIN
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

-- Trigger cho bảng CinemaClusters
CREATE TRIGGER before_insert_cinemaclusters
BEFORE INSERT ON CinemaClusters
FOR EACH ROW
BEGIN
    SET NEW.created_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

CREATE TRIGGER before_update_cinemaclusters
BEFORE UPDATE ON CinemaClusters
FOR EACH ROW
BEGIN
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

-- Trigger cho bảng Cinemas
CREATE TRIGGER before_insert_cinemas
BEFORE INSERT ON Cinemas
FOR EACH ROW
BEGIN
    SET NEW.created_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

CREATE TRIGGER before_update_cinemas
BEFORE UPDATE ON Cinemas
FOR EACH ROW
BEGIN
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

-- Trigger cho bảng Seats
CREATE TRIGGER before_insert_seats
BEFORE INSERT ON Seats
FOR EACH ROW
BEGIN
    SET NEW.created_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

CREATE TRIGGER before_update_seats
BEFORE UPDATE ON Seats
FOR EACH ROW
BEGIN
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

-- Trigger cho bảng Schedules
CREATE TRIGGER before_insert_schedules
BEFORE INSERT ON Schedules
FOR EACH ROW
BEGIN
    SET NEW.created_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

CREATE TRIGGER before_update_schedules
BEFORE UPDATE ON Schedules
FOR EACH ROW
BEGIN
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

-- Trigger cho bảng Bookings
CREATE TRIGGER before_insert_bookings
BEFORE INSERT ON Bookings
FOR EACH ROW
BEGIN
    SET NEW.created_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

CREATE TRIGGER before_update_bookings
BEFORE UPDATE ON Bookings
FOR EACH ROW
BEGIN
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

-- Trigger cho bảng Banners
CREATE TRIGGER before_insert_banners
BEFORE INSERT ON Banners
FOR EACH ROW
BEGIN
    SET NEW.created_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

CREATE TRIGGER before_update_banners
BEFORE UPDATE ON Banners
FOR EACH ROW
BEGIN
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

-- Trigger cho bảng user_roles
CREATE TRIGGER before_insert_user_roles
BEFORE INSERT ON user_roles
FOR EACH ROW
BEGIN
    SET NEW.created_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END

CREATE TRIGGER before_update_user_roles
BEFORE UPDATE ON user_roles
FOR EACH ROW
BEGIN
    SET NEW.updated_at = DATE_ADD(NOW(), INTERVAL 7 HOUR);
END



