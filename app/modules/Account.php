<?php

class Account {
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

	public static function cleanHash($email) {
		DBConnect::sendQuery('UPDATE account SET hash = :hash WHERE email = :email', ['hash' => NULL, 'email' => $email]);
	}

	public static function _prepareAndSendMain($email, $subject, $message) {
		$encoding = "utf-8";
		$subject_preferences = array(
			"input-charset" => $encoding,
			"output-charset" => $encoding,
			"line-length" => 76,
			"line-break-chars" => "\r\n"
		);
		$header = "Content-type: text/html; charset=" . $encoding . " \r\n";
		$header .= "From: grevenko@student.unit.ua \r\n";
		$header .= "MIME-Version: 1.0 \r\n";
		$header .= "Content-Transfer-Encoding: 8bit \r\n";
		$header .= "Date: " . date("r (T)") . " \r\n";
		$header .= iconv_mime_encode("Subject", $subject, $subject_preferences);

		mail($email, $subject, $message, $header);
	}

	public static function sendSignupEmail($email, $login, $password) {
		if (self::_busyLogin($login)) {
			echo json_encode(['status' => FALSE, 'message' => Message::$busyLogin]);
		} else {
			DBConnect::sendQuery('INSERT INTO account(email, login, password) VALUES (:email, :login, :password)',
			['email' => $email, 'login' => $login, 'password' => $password]);
			$hash = self::_renewHash($email);
			$link = HOST_PORT . '/signup?email=' . urlencode($email) . '&login=' . urlencode($login) . '&hash=' . urlencode($hash);
			$subject = 'Confirm your signing up to Camagru website';
			$message = 'Thanks for signing up to Camagru website! Please click this <a href=' . $link . '>link</a> to activate your account:';

			self::_prepareAndSendMain($email, $subject, $message);
			echo json_encode(['status' => TRUE, 'message' => Message::$verificationEmail]);
		}
	}
	
	public static function isHashValid($email, $hash) {
		$query_result = DBConnect::sendQuery('SELECT * FROM account WHERE email = :email AND hash = :hash',
											['email' => $email, 'hash' => $hash])->fetchAll();
		
		if (empty($query_result)) {
			return false;
		}
		return true;
	}
	
	public static function signup($email, $login, $hash) {
		if (self::isHashValid($email, $hash)) {
			DBConnect::sendQuery('UPDATE account SET active = :active WHERE login = :login', ['active' => true, 'login' => $login]);
			self::cleanHash($email);
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
											['email' => $email, 'login' => $login]);
		echo json_encode(Message::$emailChanged);
	}
	
	public static function changeLogin($new_login, $login) {
		if (self::_busyLogin($new_login)) {
			echo json_encode(Message::$busyLogin);
		} else {
			DBConnect::sendQuery('UPDATE account SET login = :new_login WHERE login = :login',
												['new_login' => $new_login, 'login' => $login]);
			$_SESSION['auth-data']['login'] = $new_login;
			echo json_encode(Message::$loginChanged);
		}
	}
	
	public static function changePassword($password, $login) {
		DBConnect::sendQuery('UPDATE account SET password = :password WHERE login = :login',
											['password' => $password, 'login' => $login]);
		echo json_encode(Message::$passwordChanged);
	}
	
	public static function sendForgotPasswordEmail($email) {
		$query_result = DBConnect::sendQuery('SELECT * FROM account WHERE email = :email', ['email' => $email])->fetchAll();

		if (empty($query_result)) {
			echo json_encode(Message::$invalidEmail);
		} else {
			$hash = self::_renewHash($email);
			$link = HOST_PORT . '/changePassword?email=' . urlencode($email) . '&hash=' . urlencode($hash);
			$subject = 'Reset your Camagru website password';
			$message = 'Thanks for signing up to Camagru website! Please click this <a href=' . $link . '>link</a> to activate your account:';

			self::_prepareAndSendMain($email, $subject, $message);
			echo json_encode(Message::$resetPasswordEmailSent);
		}
	}

	public static function resetPassword($password) {
		DBConnect::sendQuery('UPDATE account SET password = :password WHERE email = :email', ['password' => $password, 'email' => $_SESSION['auth-data']['email']]);
		echo json_encode(Message::$passwordChanged);
	}
	
	public static function isSignedIn() {
		return isset($_SESSION['auth-data']['login'])
				&& $_SESSION['auth-data']['login'] !== '';
	}

	public static function getNotificationStatus($login) {
		return DBConnect::sendQuery('SELECT notification FROM account WHERE login = :login', ['login' => $login])->fetchAll()[0]['notification'];
	}

	public static function changeNotificationStatus() {
		DBConnect::sendQuery('UPDATE account SET notification = NOT notification WHERE login = :login', ['login' => $_SESSION['auth-data']['login']]);
	}
	
	private static function _getEmail($login) {
		return DBConnect::sendQuery('SELECT email FROM account WHERE login = :login', ['login' => $login])->fetchAll()[0]['email'];
	}
	
	public static function notify($login, $comment, $author) {
		$email = Account::_getEmail($login);
		$subject = 'Your Camagru photo received a new comment!';
		$message = $author . ' commented your photo: "' . $comment . '"';

		self::_prepareAndSendMain($email, $subject, $message);
	}
}
