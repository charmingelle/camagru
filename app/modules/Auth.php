<?php

class Auth {
	private static function _busyLogin($login) {
		$query_result = DBConnect::sendQuery('SELECT login FROM account WHERE login = :login', ['login' => $login])->fetchAll();
		
		if (empty($query_result)) {
			return false;
		}
		return true;
	}

	private static function _renewHash($email) {
		$hash = md5(rand(0, 1000));

		DBConnect::sendQuery('UPDATE account SET hash = :hash WHERE email = :email', ['hash' => $hash, 'email' => $email]);
		return $hash;
	}

	public static function cleanHash($login) {
		DBConnect::sendQuery('UPDATE account SET hash = :hash WHERE login = :login', ['hash' => "", 'login' => $login]);
	}

	public static function sendSignupEmail($email, $login, $password) {
		if (self::_busyLogin($login)) {
			echo json_encode(Message::$busyLogin);
		} else {
			DBConnect::sendQuery('INSERT INTO account(email, login, password) VALUES (:email, :login, :password)',
								['email' => $email, 'login' => $login, 'password' => $password])->fetchAll();
			
			$hash = self::_renewHash($email);
			$message = 'Thanks for signing up to Camagru website!
			
			Please click this link to activate your account:
			http://localhost:7777/signup?email=' . urlencode($email) . '&login=' . urlencode($login) . '&hash=' . urlencode($hash).'
			
			';
			
			mail($email, 'Confirm your signing up to Camagru website', $message, 'From:noreply@camagru.com\r\n');
			echo json_encode(Message::$verificationEmail);
		}
	}
	
	public static function isHashValid($email, $login, $hash) {
		$query_result = DBConnect::sendQuery('SELECT * FROM account WHERE email = :email AND login = :login AND hash = :hash',
											['email' => $email, 'login' => $login, 'hash' => $hash])->fetchAll();
		
		if (empty($query_result)) {
			return false;
		}
		return true;
	}
	
	public static function signup($email, $login, $hash) {
		if (self::isHashValid($email, $login, $hash)) {
			DBConnect::sendQuery('UPDATE account SET active = :active WHERE login = :login', ['active' => true, 'login' => $login]);
			self::cleanHash($login);
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
		if (self::_busyLogin($new_login)) {
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
	
	public static function sendForgotPasswordEmail($email) {
		$hash = self::_renewHash($email);

		$query_result = DBConnect::sendQuery('SELECT login FROM account WHERE email = :email', ['email' => $email])->fetchAll();
		
		if (empty($query_result)) {
			echo json_encode(Message::$invalidEmail);
		} else {
			$login = $query_result[0]['login'];
			$message = 'Please click this link to reset your Camagru account password:
			http://localhost:7777/changePassword?email=' . urlencode($email) . '&login=' . urlencode($login) . '&hash=' . urlencode($hash).'
			
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
