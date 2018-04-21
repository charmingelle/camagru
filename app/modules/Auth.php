<?php

class Auth {
	private static function _accountExists($login) {
		$query_result = DBConnect::sendQuery('SELECT login FROM account WHERE login = :login', array('login' => $login));
		
		if (empty($query_result)) {
			return false;
		}
		return true;
	}
	
	public static function sendLink($email, $login, $password) {
		if (!self::_accountExists($login)) {
			$hash = md5(rand(0, 1000));
			$message = 'Thanks for signing up to Camagru website!
			
			Please click this link to activate your account:
			http://localhost:7777?email='.$email.'&hash='.$hash.'
			
			';
			
			mail($email, 'Confirm your signing up to Camagru website', $message, 'From:noreply@camagru.com\r\n');
			DBConnect::sendQuery('INSERT INTO account(email, login, password, hash) VALUES (:email, :login, :password, :hash)',
							array('email' => $email, 'login' => $login, 'password' => $password, 'hash' => $hash));
		}
	}
	
	private static function _validHash($email, $hash) {
		$query_result = DBConnect::sendQuery('SELECT * FROM account WHERE email = :email AND hash = :hash',
											array('email' => $email, 'hash' => $hash));
		
		if (empty($query_result)) {
			return false;
		}
		return true;
	}
	
	public static function signup($email, $hash) {
		if (self::_validHash($email, $hash)) {
			DBConnect::sendQuery('INSERT INTO account(active) VALUES (:active)', array('active' => true));
			return true;
		}
		return false;
	}
	
	public static function signin($login, $password) {
		$query_result = DBConnect::sendQuery('SELECT active FROM account WHERE login = :login AND password = :password',
											array('login' => $login, 'password' => $password));
											
		if (!empty($query_result) && $query_result[0]['active']) {
			$_SESSION['login'] = $login;
			return true;
		}
		return false;
	}
	
	public static function changeEmail($email, $login) {
		$query_result = DBConnect::sendQuery('UPDATE account SET email = :email WHERE login = :login',
											array('email' => $email, 'login' => $login));
	}
	
	public static function changeLogin($new_login, $login) {
		$query_result = DBConnect::sendQuery('UPDATE account SET login = :new_login WHERE login = :login',
											array('new_login' => $new_login, 'login' => $login));
	}
	
	public static function changePassword($password, $login) {
		$query_result = DBConnect::sendQuery('UPDATE account SET password = :password WHERE login = :login',
											array('password' => $password, 'login' => $login));
	}
}
