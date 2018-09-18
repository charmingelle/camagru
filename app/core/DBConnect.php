<?php

class DBConnect {
	static private $_pdo = NULL;

	static function sendQuery($query, $params = []) {
		if (self::$_pdo === NULL) {
			try {
				self::$_pdo = new PDO('mysql:dbname=' . DB_NAME . ';host='. DB_HOST, DB_USER, DB_PASSWORD);
				self::$_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				self::$_pdo->exec('SET NAMES utf8mb4');
			} catch (Exception $e) {
				exit($e->getMessage());
			}
		}
		try {
			$pdo_statement = self::$_pdo->prepare($query);		
			$pdo_statement->execute($params);
		} catch (Exception $e) {
			exit($e->getMessage());
		}
		return $pdo_statement;
	}
}
