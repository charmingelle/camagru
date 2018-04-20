<?php

class Auth {
	public static function signup($email, $login, $password) {
		$query_result = DBConnect::sendQuery('SELECT login FROM account WHERE login = :login', array('login' => $login));
		
		if (empty($query_result)) {
			DBConnect::sendQuery('INSERT INTO account(email, login, password) VALUES (:email, :login, :password)',
								array('email' => $email, 'login' => $login, 'password' => $password));
			return true;
		}
		return false;
	}
	
	public static function signin($login, $password) {
		$query_result = DBConnect::sendQuery('SELECT * FROM account WHERE login = :login AND password = :password',
											array('login' => $login, 'password' => $password));
		
		if (!empty($query_result)) {
			$_SESSION['login'] = $login;
			return true;
		}
		return false;
	}
}
