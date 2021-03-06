-- MySQL Script generated by MySQL Workbench
-- Fri Feb 25 10:57:10 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema pradb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pradb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pradb` DEFAULT CHARACTER SET utf8 ;
USE `pradb` ;

-- -----------------------------------------------------
-- Table `pradb`.`member_types`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`member_types` ;

CREATE TABLE IF NOT EXISTS `pradb`.`member_types` (
  `member_type_id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(255) NOT NULL,
  `base_dues_amt` FLOAT NULL,
  PRIMARY KEY (`member_type_id`))
ENGINE = InnoDB;

drop table if exists pradb.membership_types;

CREATE TABLE IF NOT EXISTS `pradb`.`membership_types` (
  `membership_type_id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(255) NOT NULL,
  `base_dues_amt` FLOAT NULL,
  PRIMARY KEY (`membership_type_id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `pradb`.`member`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`member` ;

CREATE TABLE IF NOT EXISTS `pradb`.`member` (
  `member_id` INT NOT NULL AUTO_INCREMENT,
  `membership_id` INT NULL,
  `uuid` VARCHAR(255) NULL,
  `member_type_id` INT NOT NULL,
  `first_name` VARCHAR(255) NULL,
  `last_name` VARCHAR(255) NULL,
  `phone_number` VARCHAR(255) NULL,
  `occupation` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `birthdate` DATE NULL,
  `date_joined` DATE NULL,
  `last_modified_date` DATE NULL,
  `last_modified_by` INT NULL,
  `active` BIT NOT NULL,
  PRIMARY KEY (`member_id`),
  UNIQUE INDEX `uuid_UNIQUE` (`uuid` ASC) VISIBLE,
  INDEX `member_type_id_idx` (`member_type_id` ASC) VISIBLE,
  INDEX `last_modified_by_idx` (`last_modified_by` ASC) VISIBLE,
  INDEX `membership_id_idx` (`membership_id` ASC) VISIBLE,
  CONSTRAINT `FK_member_type`
    FOREIGN KEY (`member_type_id`)
    REFERENCES `pradb`.`member_types` (`member_type_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_member_lm`
    FOREIGN KEY (`last_modified_by`)
    REFERENCES `pradb`.`member` (`member_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_member_membership`
    FOREIGN KEY (`membership_id`)
    REFERENCES `pradb`.`membership` (`membership_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pradb`.`membership`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`membership` ;

CREATE TABLE IF NOT EXISTS `pradb`.`membership` (
  `membership_id` INT NOT NULL AUTO_INCREMENT,
  `status` ENUM('Pending', 'Active', 'Disabled') NOT NULL,
  `cur_year_renewed` BIT NOT NULL,
  `view_online` BIT NOT NULL,
  `renewal_sent` BIT NOT NULL,
  `last_modified_date` DATE NULL,
  `last_modified_by` INT NULL,
  `year_joined` INT NULL,
  `address` VARCHAR(255) NULL,
  `city` VARCHAR(255) NULL,
  `state` VARCHAR(255) NULL,
  `zip` VARCHAR(255) NULL,
  `membership_admin_id` INT NULL,
  PRIMARY KEY (`membership_id`),
  INDEX `FK_membership_lm_idx` (`last_modified_by` ASC) VISIBLE,
  INDEX `FK_membership_admin_idx` (`membership_admin_id` ASC) VISIBLE,
  CONSTRAINT `FK_membership_lm`
    FOREIGN KEY (`last_modified_by`)
    REFERENCES `pradb`.`member` (`member_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_membership_admin`
    FOREIGN KEY (`membership_admin_id`)
    REFERENCES `pradb`.`member` (`member_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

ALTER TABLE `pradb`.`membership`
ADD COLUMN `membership_type_id` INT(11) NULL AFTER `OLD_MEMBERSHIP_ID`,
ADD INDEX `FK_membership_type_idx` (`membership_type_id` ASC);
ALTER TABLE `pradb`.`membership`
ADD CONSTRAINT `FK_membership_type`
  FOREIGN KEY (`membership_type_id`)
  REFERENCES `pradb`.`membership_types` (`membership_type_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

-- -----------------------------------------------------
-- Table `pradb`.`member_bikes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`member_bikes` ;

CREATE TABLE IF NOT EXISTS `pradb`.`member_bikes` (
  `bike_id` INT NOT NULL AUTO_INCREMENT,
  `year` VARCHAR(10) NULL,
  `make` VARCHAR(50) NULL,
  `model` VARCHAR(50) NULL,
  `membership_id` INT NOT NULL,
  PRIMARY KEY (`bike_id`),
  INDEX `membership_id_idx` (`membership_id` ASC) VISIBLE,
  CONSTRAINT `FK_bike_membership`
    FOREIGN KEY (`membership_id`)
    REFERENCES `pradb`.`membership` (`membership_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pradb`.`member_bill`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`member_bill` ;

CREATE TABLE IF NOT EXISTS `pradb`.`member_bill` (
  `bill_id` INT NOT NULL AUTO_INCREMENT,
  `generated_date` DATE NULL,
  `year` INT NULL,
  `amount` DOUBLE NULL,
  `amount_with_fee` DOUBLE NULL,
  `membership_id` INT NOT NULL,
  `emailed_bill` DATE NULL,
  `cur_year_paid` BIT NOT NULL,
  `work_detail` JSON NULL,
  PRIMARY KEY (`bill_id`),
  INDEX `membership_id_idx` (`membership_id` ASC) VISIBLE,
  CONSTRAINT `FK_bill_membership`
    FOREIGN KEY (`membership_id`)
    REFERENCES `pradb`.`membership` (`membership_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

ALTER TABLE `pradb`.`member_bill` 
ADD COLUMN `threshold` DOUBLE NULL DEFAULT NULL AFTER `cur_year_paid`,
ADD COLUMN `points_earned` DOUBLE NULL DEFAULT NULL AFTER `threshold`;

-- -----------------------------------------------------
-- Table `pradb`.`member_status`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`member_status` ;

CREATE TABLE IF NOT EXISTS `pradb`.`member_status` (
  `member_status_id` INT NOT NULL AUTO_INCREMENT,
  `member_id` INT NOT NULL,
  `year` INT NULL,
  `status` VARCHAR(255) NULL,
  PRIMARY KEY (`member_status_id`),
  INDEX `member_id_idx` (`member_id` ASC) VISIBLE,
  CONSTRAINT `FK_status_member`
    FOREIGN KEY (`member_id`)
    REFERENCES `pradb`.`member` (`member_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pradb`.`board_member_title`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`board_member_title` ;

CREATE TABLE IF NOT EXISTS `pradb`.`board_member_title` (
  `board_title_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`board_title_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pradb`.`board_member`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`board_member` ;

CREATE TABLE IF NOT EXISTS `pradb`.`board_member` (
  `board_id` INT NOT NULL AUTO_INCREMENT,
  `year` INT NULL,
  `member_id` INT NOT NULL,
  `board_title_id` INT NOT NULL,
  PRIMARY KEY (`board_id`),
  INDEX `board_title_id_idx` (`board_title_id` ASC) VISIBLE,
  INDEX `member_id_idx` (`member_id` ASC) VISIBLE,
  CONSTRAINT `FK_board_title`
    FOREIGN KEY (`board_title_id`)
    REFERENCES `pradb`.`board_member_title` (`board_title_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_board_member`
    FOREIGN KEY (`member_id`)
    REFERENCES `pradb`.`member` (`member_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pradb`.`riding_area_status`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`riding_area_status` ;

CREATE TABLE IF NOT EXISTS `pradb`.`riding_area_status` (
  `riding_area_status_id` INT NOT NULL AUTO_INCREMENT,
  `area_name` VARCHAR(255) NOT NULL,
  `status` BIT NOT NULL,
  PRIMARY KEY (`riding_area_status_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pradb`.`event_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`event_type` ;

CREATE TABLE IF NOT EXISTS `pradb`.`event_type` (
  `event_type_id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(255) NOT NULL,
  `last_modified_date` DATE NULL,
  `last_modified_by` INT NULL,
  `active` BIT NOT NULL,
  PRIMARY KEY (`event_type_id`),
  INDEX `FK_event_type_lm_idx` (`last_modified_by` ASC) VISIBLE,
  CONSTRAINT `FK_event_type_lm`
    FOREIGN KEY (`last_modified_by`)
    REFERENCES `pradb`.`member` (`member_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pradb`.`event`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`event` ;

CREATE TABLE IF NOT EXISTS `pradb`.`event` (
  `event_id` INT NOT NULL AUTO_INCREMENT,
  `event_type_id` INT NOT NULL,
  `event_name` VARCHAR(255) NULL,
  `event_description` VARCHAR(255) NULL,
  `start_date` DATETIME NULL,
  `end_date` DATETIME NULL,
  PRIMARY KEY (`event_id`),
  INDEX `event_type_id_idx` (`event_type_id` ASC) VISIBLE,
  CONSTRAINT `FK_event_type`
    FOREIGN KEY (`event_type_id`)
    REFERENCES `pradb`.`event_type` (`event_type_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pradb`.`job_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`job_type` ;

CREATE TABLE IF NOT EXISTS `pradb`.`job_type` (
  `job_type_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `point_value` FLOAT NULL,
  `cash_value` FLOAT NULL,
  `job_day_number` INT NULL,
  `start_time` TIME NULL,
  `end_time` TIME NULL,
  `active` BIT NOT NULL,
  `reserved` BIT NOT NULL,
  `online` BIT NOT NULL,
  `meal_ticket` BIT NOT NULL,
  `sort_order` INT NULL,
  `last_modified_date` DATE NULL,
  `last_modified_by` INT NULL,
  PRIMARY KEY (`job_type_id`),
  INDEX `last_modified_by_idx` (`last_modified_by` ASC) VISIBLE,
  CONSTRAINT `FK_jobtype_lm`
    FOREIGN KEY (`last_modified_by`)
    REFERENCES `pradb`.`member` (`member_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pradb`.`job`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`job` ;

CREATE TABLE IF NOT EXISTS `pradb`.`job` (
  `job_id` INT NOT NULL AUTO_INCREMENT,
  `member_id` INT NULL,
  `event_id` INT NULL,
  `job_type_id` INT NOT NULL,
  `job_start_date` DATETIME NULL,
  `job_end_date` DATETIME NULL,
  `last_modified_date` DATE NULL,
  `last_modified_by` INT NULL,
  `verified` BIT NOT NULL,
  `verified_date` DATE NULL,
  `points_awarded` FLOAT NULL,
  `paid` BIT NOT NULL,
  `paid_date` DATE NULL,
  PRIMARY KEY (`job_id`),
  INDEX `member_id_idx` (`member_id` ASC) VISIBLE,
  INDEX `event_id_idx` (`event_id` ASC) VISIBLE,
  INDEX `job_type_id_idx` (`job_type_id` ASC) VISIBLE,
  INDEX `last_modified_by_idx` (`last_modified_by` ASC) VISIBLE,
  CONSTRAINT `FK_job_member`
    FOREIGN KEY (`member_id`)
    REFERENCES `pradb`.`member` (`member_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_job_event`
    FOREIGN KEY (`event_id`)
    REFERENCES `pradb`.`event` (`event_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_job_type`
    FOREIGN KEY (`job_type_id`)
    REFERENCES `pradb`.`job_type` (`job_type_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_job_lm`
    FOREIGN KEY (`last_modified_by`)
    REFERENCES `pradb`.`member` (`member_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

ALTER TABLE `pradb`.`job` 
ADD COLUMN `paid_labor` VARCHAR(255) NULL AFTER `member_id`;

-- -----------------------------------------------------
-- Table `pradb`.`event_job`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`event_job` ;

CREATE TABLE IF NOT EXISTS `pradb`.`event_job` (
  `event_job_id` INT NOT NULL AUTO_INCREMENT,
  `event_type_id` INT NOT NULL,
  `job_type_id` INT NOT NULL,
  `count` INT NOT NULL,
  PRIMARY KEY (`event_job_id`),
  INDEX `event_type_id_idx` (`event_type_id` ASC) VISIBLE,
  INDEX `job_type_id_idx` (`job_type_id` ASC) VISIBLE,
  CONSTRAINT `FK_ej_eventtype`
    FOREIGN KEY (`event_type_id`)
    REFERENCES `pradb`.`event_type` (`event_type_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_ej_jobtype`
    FOREIGN KEY (`job_type_id`)
    REFERENCES `pradb`.`job_type` (`job_type_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pradb`.`point_threshold`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pradb`.`point_threshold` ;

CREATE TABLE IF NOT EXISTS `pradb`.`point_threshold` (
  `year` INT NOT NULL,
  `amount` INT NOT NULL,
  PRIMARY KEY (`year`))
ENGINE = InnoDB;

CREATE TABLE `pradb`.`gate_code` (
  `gate_code_id` INT NOT NULL AUTO_INCREMENT,
  `year` INT NULL,
  `gate_code` VARCHAR(20) NULL,
  PRIMARY KEY (`gate_code_id`),
  UNIQUE INDEX `gate_code_id_UNIQUE` (`gate_code_id` ASC),
  INDEX `idx_gate_code_year` (`year` ASC));

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
