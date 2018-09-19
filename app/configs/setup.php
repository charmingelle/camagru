<?php
	require_once('database.php');
	require_once('./../core/DBConnect.php');

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
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;');

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
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;');

	DBConnect::sendQuery('DELETE FROM `sticker`;');

	DBConnect::sendQuery('INSERT INTO `sticker` (`url`) VALUES
		("sticker/1.png"),
		("sticker/2.png"),
		("sticker/3.png"),
		("sticker/4.png"),
		("sticker/5.png"),
		("sticker/6.png"),
		("sticker/7.png"),
		("sticker/8.jpg"),
		("sticker/9.png"),
		("sticker/10.png"),
		("sticker/11.svg"),
		("sticker/12.png"),
		("sticker/13.png"),
		("sticker/14.svg"),
		("sticker/15.png"),
		("sticker/16.png"),
		("sticker/17.png"),
		("sticker/18.png"),
		("sticker/19.png"),
		("sticker/20.png")');
