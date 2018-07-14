<?php

class Auth {
	private static function _loginExists($login) {
		$query_result = DBConnect::sendQuery('SELECT login FROM account WHERE login = :login', ['login' => $login])->fetchAll();
		
		if (empty($query_result)) {
			return false;
		}
		return true;
	}
	
	public static function sendLink($email, $login, $password) {
		if (!self::_loginExists($login)) {
			$hash = md5(rand(0, 1000));
			$message = 'Thanks for signing up to Camagru website!
			
			Please click this link to activate your account:
			http://localhost:7777/signup?email='.$email.'&hash='.$hash.'
			
			';
			
			mail($email, 'Confirm your signing up to Camagru website', $message, 'From:noreply@camagru.com\r\n');
			DBConnect::sendQuery('INSERT INTO account(email, login, password, hash) VALUES (:email, :login, :password, :hash)',
							['email' => $email, 'login' => $login, 'password' => $password, 'hash' => $hash])->fetchAll();
			echo json_encode(Message::$verificationEmail);
		} else {
			echo json_encode(Message::$busyLogin);
		}
	}
	
	private static function _validHash($email, $hash) {
		$query_result = DBConnect::sendQuery('SELECT * FROM account WHERE email = :email AND hash = :hash',
											['email' => $email, 'hash' => $hash])->fetchAll();
		
		if (empty($query_result)) {
			return false;
		}
		return true;
	}
	
	public static function signup($email, $hash) {
		if (self::_validHash($email, $hash)) {
			DBConnect::sendQuery('INSERT INTO account(active) VALUES (:active)', ['active' => true])->fetchAll();
			return true;
		}
		return false;
	}
	
	public static function signin($login, $password) {
		$query_result = DBConnect::sendQuery('SELECT active FROM account WHERE login = :login AND password = :password',
											['login' => $login, 'password' => $password])->fetchAll();
											
		if (!empty($query_result) && $query_result[0]['active']) {
			$_SESSION['auth-data']['login'] = $login;
			return true;
		}
		return false;
	}
	
	public static function changeEmail($email, $login) {
		DBConnect::sendQuery('UPDATE account SET email = :email WHERE login = :login',
											['email' => $email, 'login' => $login])->fetchAll();
		echo json_encode(Message::$emailChanged);
	}
	
	public static function changeLogin($new_login, $login) {
		if (self::_loginExists($new_login)) {
			echo json_encode(Message::$busyLogin);
		} else {
			DBConnect::sendQuery('UPDATE account SET login = :new_login WHERE login = :login',
												['new_login' => $new_login, 'login' => $login])->fetchAll();
			$_SESSION['auth-data']['login'] = $new_login;
			echo json_encode(Message::$loginChanged);
		}
	}
	
	public static function changePassword($password, $login) {
		DBConnect::sendQuery('UPDATE account SET password = :password WHERE login = :login',
											['password' => $password, 'login' => $login])->fetchAll();
		echo json_encode(Message::$passwordChanged);
	}
	
	public static function sendResetLink($email) {
		$query_result = DBConnect::sendQuery('SELECT login, hash FROM account WHERE email = :email', ['email' => $email])->fetchAll();
		
		if (empty($query_result)) {
			echo json_encode(Message::$invalidEmail);
		} else {
			$login = $query_result[0]['login'];
			$hash = $query_result[0]['hash'];
			$message = 'Please click this link to reset your Camagru account password:
			http://localhost:7777/changePassword?login='.$login.'&hash='.$hash.'
			
			';
			
			mail($email, 'Reset your Camagru website password', $message, 'From:noreply@camagru.com\r\n');
			echo json_encode(Message::$resetPasswordEmailSent);
		}
	}
	
	public static function isSignedIn() {
		return isset($_SESSION['auth-data']['login'])
				&& $_SESSION['auth-data']['login'] !== '';
	}
}
