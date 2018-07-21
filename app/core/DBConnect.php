<?php

class DBConnect {
	static private $_pdo = NULL;

	static function sendQuery($query, $params = []) {
		if (self::$_pdo === NULL) {
			try {
				self::$_pdo = new PDO('mysql:dbname=' . DB_NAME . ';host='. DB_HOST, DB_USER, DB_PASSWORD);
			} catch (Exception $e) {
				exit($e->getMessage());
			}
		}
		try {
			self::$_pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
			$pdo_statement = self::$_pdo->prepare($query);
			$pdo_statement->execute($params);
		} catch (Exception $e) {
			exit($e->getMessage());
		}
		return $pdo_statement;
	}

	static function	success(PDOStatement $pdo)
	{
		$info = $pdo->errorInfo();
		
		if ($info[0] == "00000") {
			return (true);
		} else {
			return ($info[2]);
		}
	}
}
