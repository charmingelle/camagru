-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 02, 2018 at 02:17 AM
-- Server version: 5.7.21
-- PHP Version: 7.1.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `camagru`
--
CREATE DATABASE IF NOT EXISTS `camagru` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `camagru`;

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` int(11) UNSIGNED NOT NULL,
  `email` varchar(128) NOT NULL,
  `login` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL,
  `hash` varchar(128) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `email`, `login`, `password`, `hash`, `active`) VALUES
(15, 'vasya@gmail.com', 'vasya', 'fd9d94340dbd72c11b37ebb0d2a19b4d05e00fd78e4e2ce8923b9ea3a54e900df181cfb112a8a73228d1f3551680e2ad9701a4fcfb248fa7fa77b95180628bb2', 'aab3238922bcc25a6f606eb525ffdc56', 1),
(16, 'kolya@gmail.com', 'kolya', 'fd9d94340dbd72c11b37ebb0d2a19b4d05e00fd78e4e2ce8923b9ea3a54e900df181cfb112a8a73228d1f3551680e2ad9701a4fcfb248fa7fa77b95180628bb2', 'b7ee6f5f9aa5cd17ca1aea43ce848496', 1),
(17, 'revenkoaa89@gmail.com', 'anna', '1076b5d0e91f96719f87c79f63ee6aa9e2cf40336adfdf04ca2f254032df689db0feeb37f9585f28cd0c9251c646844b658b8ae1a396234786fbfbe29cd9f7a4', '950a4152c2b4aa3ad78bdd6b366cc179', 1);

-- --------------------------------------------------------

--
-- Table structure for table `account_photo`
--

CREATE TABLE `account_photo` (
  `accountID` int(11) UNSIGNED NOT NULL,
  `photoID` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `photo`
--

CREATE TABLE `photo` (
  `id` int(11) UNSIGNED NOT NULL,
  `url` varchar(2083) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `photo`
--

INSERT INTO `photo` (`id`, `url`) VALUES
(1, 'http://localhost:777/public/photo/1.jpg'),
(2, '../../public/photo/2.jpg'),
(3, '../../public/photo/3.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`);

--
-- Indexes for table `account_photo`
--
ALTER TABLE `account_photo`
  ADD KEY `account_account_photo` (`accountID`),
  ADD KEY `account_photo_photo` (`photoID`);

--
-- Indexes for table `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `photo`
--
ALTER TABLE `photo`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account_photo`
--
ALTER TABLE `account_photo`
  ADD CONSTRAINT `account_account_photo` FOREIGN KEY (`accountID`) REFERENCES `account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `account_photo_photo` FOREIGN KEY (`photoID`) REFERENCES `photo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
