<?php

require_once(getRoot() . 'app/configs/db.php');

class DBConnect {
	static private $_pdo = NULL;

	static function sendQuery($query, $params) {
		if (self::$_pdo === NULL) {
			try {
				self::$_pdo = new PDO('mysql:dbname=' . DB_NAME . ';host='. DB_HOST, DB_USER, DB_PASSWORD);
			} catch (Exception $e) {
				exit($e->getMessage());
			}
		}
		try {
			$pdo_statement = self::$_pdo->prepare($query);
		} catch (Exception $e) {
			exit($e->getMessage());
		}
		try {
			$pdo_statement->execute($params);
		} catch (Exception $e) {
			exit($e->getMessage());
		}
		$entries = $pdo_statement->fetchAll();
		return $entries;
	}
}
