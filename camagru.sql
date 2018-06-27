-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 27, 2018 at 08:17 AM
-- Server version: 5.7.21
-- PHP Version: 7.1.15

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
(17, 'hgj', 'kgk', '344907e89b981caf221d05f597eb57a6af408f15f4dd7895bbd1b96a2938ec24a7dcf23acb94ece0b6d7b0640358bc56bdb448194b9305311aff038a834a079f', '950a4152c2b4aa3ad78bdd6b366cc179', 1),
(18, 'pavel777@gmail.com', 'pavel777', '1076b5d0e91f96719f87c79f63ee6aa9e2cf40336adfdf04ca2f254032df689db0feeb37f9585f28cd0c9251c646844b658b8ae1a396234786fbfbe29cd9f7a4', 'e0c641195b27425bb056ac56f8953d24', 1),
(19, 'liza@gmail.com', 'liza', '37c8bcf5fdcac95ab033bc89d100c3a2d61ec445e75b3a285aab510ff0eb87933802cf3b31b02bf761657ab6af618bdf5f11963ebae63467f671d3aecb38cd06', '839ab46820b524afda05122893c2fe8e', 1),
(21, 'annar703unit@gmail.com', 'anna', 'fd9d94340dbd72c11b37ebb0d2a19b4d05e00fd78e4e2ce8923b9ea3a54e900df181cfb112a8a73228d1f3551680e2ad9701a4fcfb248fa7fa77b95180628bb2', '1f50893f80d6830d62765ffad7721742', 1),
(22, 'pavel@gmail.com', 'pavel', 'fd9d94340dbd72c11b37ebb0d2a19b4d05e00fd78e4e2ce8923b9ea3a54e900df181cfb112a8a73228d1f3551680e2ad9701a4fcfb248fa7fa77b95180628bb2', '1c383cd30b7c298ab50293adfecb7b18', 1);

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) UNSIGNED NOT NULL,
  `comment` varchar(8000) NOT NULL,
  `photo_id` int(11) UNSIGNED NOT NULL,
  `login` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `comment`, `photo_id`, `login`) VALUES
(14, 'first', 1, 'anna'),
(15, 'second', 1, 'anna'),
(16, 'third', 1, 'anna'),
(17, 'first', 2, 'anna'),
(18, 'secind', 2, 'anna'),
(19, 'third', 2, 'anna'),
(20, 'first', 3, 'anna'),
(21, 'second', 3, 'anna'),
(22, 'third', 3, 'anna'),
(23, 'fourth', 1, 'anna');

-- --------------------------------------------------------

--
-- Table structure for table `photo`
--

CREATE TABLE `photo` (
  `id` int(11) UNSIGNED NOT NULL,
  `url` varchar(2083) NOT NULL,
  `likes` int(11) NOT NULL DEFAULT '0',
  `comments` int(11) NOT NULL DEFAULT '0',
  `login` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `photo`
--

INSERT INTO `photo` (`id`, `url`, `likes`, `comments`, `login`) VALUES
(1, 'photo/1.png', 25, 4, ''),
(2, 'photo/2.jpg', 3, 3, ''),
(3, 'photo/3.jpg', 0, 3, ''),
(4, 'photo/4.jpeg', 3, 0, ''),
(5, 'photo/5.jpg', 0, 0, ''),
(6, 'photo/6.jpg', 0, 0, ''),
(7, 'photo/7.jpg', 0, 0, ''),
(8, 'photo/8.jpg', 0, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `sticker`
--

CREATE TABLE `sticker` (
  `id` int(11) UNSIGNED NOT NULL,
  `url` varchar(2083) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sticker`
--

INSERT INTO `sticker` (`id`, `url`) VALUES
(1, 'sticker/1.png'),
(2, 'sticker/2.png'),
(3, 'sticker/3.png'),
(4, 'sticker/4.png'),
(5, 'sticker/5.png');

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
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `photoID_commentID` (`photo_id`);

--
-- Indexes for table `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sticker`
--
ALTER TABLE `sticker`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `photo`
--
ALTER TABLE `photo`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `sticker`
--
ALTER TABLE `sticker`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `photoID_commentID` FOREIGN KEY (`photo_id`) REFERENCES `photo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
