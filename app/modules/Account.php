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

	public static function sendSignupEmail($email, $login, $password) {
		if (self::_busyLogin($login)) {
			echo json_encode(Message::$busyLogin);
		} else {
			DBConnect::sendQuery('INSERT INTO account(email, login, password) VALUES (:email, :login, :password)',
			['email' => $email, 'login' => $login, 'password' => $password]);
			$hash = self::_renewHash($email);
			$link = 'http://localhost:7777/signup?email=' . urlencode($email) . '&login=' . urlencode($login) . '&hash=' . urlencode($hash);
			$message = 'Thanks for signing up to Camagru website! Please click this <a href=' . $link . '>link</a> to activate your account:';
			$encoding = "utf-8";
			$mail_subject = 'Confirm your signing up to Camagru website';
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
			$header .= iconv_mime_encode("Subject", $mail_subject, $subject_preferences);

			mail($email, $mail_subject, $message, $header);
			echo json_encode(Message::$verificationEmail);
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
			$link = 'http://localhost:7777/changePassword?email=' . urlencode($email) . '&hash=' . urlencode($hash);
			$message = 'Thanks for signing up to Camagru website! Please click this <a href=' . $link . '>link</a> to activate your account:';
			$encoding = "utf-8";
			$mail_subject = 'Reset your Camagru website password';
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
			$header .= iconv_mime_encode("Subject", $mail_subject, $subject_preferences);

			mail($email, $mail_subject, $message, $header);
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

	public static function getNotification($login) {
		return DBConnect::sendQuery('SELECT notification FROM account WHERE login = :login', ['login' => $login])->fetchAll()[0]['notification'];
	}

	public static function changeNotification() {
		DBConnect::sendQuery('UPDATE account SET notification = NOT notification WHERE login = :login', ['login' => $_SESSION['auth-data']['login']]);
	}
	
	private static function _getEmail($login) {
		return DBConnect::sendQuery('SELECT email FROM account WHERE login = :login', ['login' => $login])->fetchAll()[0]['email'];
	}
	
	public static function notify($login, $comment, $author) {
		$email = Account::_getEmail($login);
		$message = '$author commented your photo: "$comment"';
		
		mail($email, 'Your photo received a new comment!', $message, 'From:noreply@camagru.com\r\n');
	}
}
