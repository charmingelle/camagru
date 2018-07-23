-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 21, 2018 at 10:05 AM
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
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `notification` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `email`, `login`, `password`, `hash`, `active`, `notification`) VALUES
(15, 'vasya@gmail.com', 'vasya', 'fd9d94340dbd72c11b37ebb0d2a19b4d05e00fd78e4e2ce8923b9ea3a54e900df181cfb112a8a73228d1f3551680e2ad9701a4fcfb248fa7fa77b95180628bb2', '', 1, 1),
(16, 'kolya@gmail.com', 'kolya', 'fd9d94340dbd72c11b37ebb0d2a19b4d05e00fd78e4e2ce8923b9ea3a54e900df181cfb112a8a73228d1f3551680e2ad9701a4fcfb248fa7fa77b95180628bb2', '', 1, 1),
(17, 'sasha@gmail.com', 'sasha', 'fd9d94340dbd72c11b37ebb0d2a19b4d05e00fd78e4e2ce8923b9ea3a54e900df181cfb112a8a73228d1f3551680e2ad9701a4fcfb248fa7fa77b95180628bb2', '', 1, 1),
(18, 'pavel777@gmail.com', 'olya', 'fd9d94340dbd72c11b37ebb0d2a19b4d05e00fd78e4e2ce8923b9ea3a54e900df181cfb112a8a73228d1f3551680e2ad9701a4fcfb248fa7fa77b95180628bb2', '', 1, 0),
(19, 'liza@gmail.com', 'liza', 'fd9d94340dbd72c11b37ebb0d2a19b4d05e00fd78e4e2ce8923b9ea3a54e900df181cfb112a8a73228d1f3551680e2ad9701a4fcfb248fa7fa77b95180628bb2', '', 1, 1),
(21, 'annar703unit@gmail.com', 'anna', 'fd9d94340dbd72c11b37ebb0d2a19b4d05e00fd78e4e2ce8923b9ea3a54e900df181cfb112a8a73228d1f3551680e2ad9701a4fcfb248fa7fa77b95180628bb2', '', 1, 1),
(22, 'pavel@gmail.com', 'pavel', 'fd9d94340dbd72c11b37ebb0d2a19b4d05e00fd78e4e2ce8923b9ea3a54e900df181cfb112a8a73228d1f3551680e2ad9701a4fcfb248fa7fa77b95180628bb2', '', 1, 1);

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
(15, 'second', 1, 'anna'),
(16, 'third', 1, 'anna'),
(17, 'first', 2, 'anna'),
(18, 'secind', 2, 'anna'),
(19, 'third', 2, 'anna'),
(20, 'first', 3, 'anna'),
(21, 'second', 3, 'anna'),
(22, 'third', 3, 'anna'),
(23, 'fourth', 1, 'anna'),
(24, 'fifth', 1, 'anna'),
(25, 'first', 4, 'anna'),
(26, 'sixth', 1, 'anna'),
(27, 'seventh', 1, 'anna'),
(28, 'eighth', 1, 'anna'),
(29, 'nineth', 1, 'anna'),
(30, 'fourth', 2, 'anna'),
(31, 'tenth', 1, 'anna'),
(32, 'cool photo', 5, 'anna'),
(33, 'the second one', 5, 'anna'),
(34, 'the third one', 5, 'olya'),
(36, 'second', 20, 'anna'),
(39, 'third', 20, 'olya');

-- --------------------------------------------------------

--
-- Table structure for table `photo`
--

CREATE TABLE `photo` (
  `id` int(11) UNSIGNED NOT NULL,
  `url` varchar(2083) NOT NULL,
  `likes` int(11) NOT NULL DEFAULT '0',
  `comments` int(11) NOT NULL DEFAULT '0',
  `login` varchar(128) NOT NULL,
  `private` tinyint(4) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `photo`
--

INSERT INTO `photo` (`id`, `url`, `likes`, `comments`, `login`, `private`) VALUES
(1, 'photo/1.png', 42, 12, 'vasya', 0),
(2, 'photo/2.jpg', 9, 4, 'kolya', 0),
(3, 'photo/3.jpg', 4, 3, 'olya', 0),
(4, 'photo/4.jpeg', 4, 1, 'olya', 0),
(5, 'photo/5.jpg', 3, 3, 'olya', 0),
(6, 'photo/6.jpg', 0, 0, 'pavel', 1),
(7, 'photo/7.jpg', 0, 0, 'liza', 1),
(8, 'photo/8.jpg', 0, 1, 'kolya', 0),
(20, 'photo/1.png', 2, 4, 'anna', 0);

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
(5, 'sticker/5.png'),
(6, 'sticker/6.png');

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
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `photo`
--
ALTER TABLE `photo`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `sticker`
--
ALTER TABLE `sticker`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
