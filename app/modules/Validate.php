<?php

class Validate {
	public static function isValidEmail($email) {
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			return false;
		}
		return true;
	}

	public static function busyEmail($email) {
		$query_result = DBConnect::sendQuery('SELECT email FROM account WHERE email = :email', ['email' => $email])->fetchAll();
		
		if (empty($query_result)) {
			return false;
		}
		return true;
	}
	
	public static function isValidLogin($login) {
		if (ctype_alnum($login) && ctype_alpha($login[0])) {
			return true;
		}
		return false;
	}
	
	public static function isValidPassword($password) {
		if (ctype_alnum($password) && strlen($password) >= 6) {
			return true;
		}
		return false;
	}
}
