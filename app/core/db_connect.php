<?php
	require_once(getRoot() . 'configs/db.php');

	class DBConnect {
		static private $_pdo = NULL;

		static function send_query($query, $params) {
			if (self::$_pdo === NULL) {
				self::$_pdo = new PDO(DB_HOST, DB_USER, DB_PASSWD);
			}
			$prep_query = self::$_pdo->prepare($query);

			if ($prep_query !== false) {
				$result = $prep_query->execute($params);
				$entries = $result->fecthAll();

				return $entries;
			}
			return false;
		}
	}
?>
