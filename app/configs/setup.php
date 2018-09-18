<?php
	require_once('database.php');
	require_once('./../core/DBConnect.php');

	DBConnect::sendQuery('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";');
	DBConnect::sendQuery('SET AUTOCOMMIT = 0;');
	DBConnect::sendQuery('START TRANSACTION;');
	DBConnect::sendQuery('SET time_zone = "+00:00";');
	
	DBConnect::sendQuery('CREATE DATABASE IF NOT EXISTS `camagru` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
	USE `camagru`;');
	
	DBConnect::sendQuery('CREATE TABLE IF NOT EXISTS `account` (
	  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	  `email` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
	  `login` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
	  `password` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
	  `hash` varchar(128) CHARACTER SET utf8mb4 DEFAULT NULL,
	  `active` tinyint(1) NOT NULL DEFAULT "0",
	  `notification` tinyint(1) NOT NULL DEFAULT "1",
	  PRIMARY KEY (`id`),
	  UNIQUE KEY `login` (`login`)
	) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;');
	
	DBConnect::sendQuery('CREATE TABLE IF NOT EXISTS `likes` (
	  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	  `photo_id` int(11) UNSIGNED NOT NULL,
	  `login` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
	  PRIMARY KEY (`id`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
	
	DBConnect::sendQuery('CREATE TABLE IF NOT EXISTS `photo` (
	  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	  `url` varchar(2083) CHARACTER SET utf8mb4 NOT NULL,
	  `likes` int(11) NOT NULL DEFAULT "0",
	  `comments` int(11) NOT NULL DEFAULT "0",
	  `login` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
	  `private` tinyint(4) NOT NULL DEFAULT "1",
	  PRIMARY KEY (`id`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
	
	DBConnect::sendQuery('CREATE TABLE IF NOT EXISTS `comment` (
	  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	  `comment` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
	  `photo_id` int(11) UNSIGNED NOT NULL,
	  `login` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
	  PRIMARY KEY (`id`),
	  CONSTRAINT `photoID_commentID` FOREIGN KEY (`photo_id`) REFERENCES `photo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
	
	DBConnect::sendQuery('CREATE TABLE IF NOT EXISTS `sticker` (
	  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	  `url` varchar(2083) CHARACTER SET utf8mb4 NOT NULL,
	  PRIMARY KEY (`id`)
	) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;');
	
	DBConnect::sendQuery('DELETE FROM `sticker`;');
	
	DBConnect::sendQuery('INSERT INTO `sticker` (`id`, `url`) VALUES
	(1, "sticker/1.png"),
	(2, "sticker/2.png"),
	(3, "sticker/3.png"),
	(4, "sticker/4.png"),
	(5, "sticker/5.png"),
	(6, "sticker/6.png"),
	(7, "sticker/7.png"),
	(8, "sticker/8.jpg"),
	(9, "sticker/9.png"),
	(10, "sticker/10.png"),
	(11, "sticker/11.svg"),
	(12, "sticker/12.png"),
	(13, "sticker/13.png");');
