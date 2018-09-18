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
			file_put_contents('/Users/grevenko/mamp/apache2/logs/error_log', $query . PHP_EOL, FILE_APPEND);
			$pdo_statement = self::$_pdo->prepare($query);
			file_put_contents('/Users/grevenko/mamp/apache2/logs/error_log', implode(' ', $pdo_statement->errorInfo()) . PHP_EOL, FILE_APPEND);			
			$result = $pdo_statement->execute($params);
			file_put_contents('/Users/grevenko/mamp/apache2/logs/error_log', implode(' ', $pdo_statement->errorInfo()) . PHP_EOL, FILE_APPEND);
			file_put_contents('/Users/grevenko/mamp/apache2/logs/error_log', $result . PHP_EOL, FILE_APPEND);
		} catch (Exception $e) {
			exit($e->getMessage());
		}
		return $pdo_statement;
	}
}
