<?php

class AuthController {
	public static function sendVerification() {
		$body = Utils::getBodyFromJson();
		
		if (!isset($body['email']) || $body['email'] === ''
			|| !isset($body['login']) || $body['login'] === ''
			|| !isset($body['password']) || $body['password'] === '') {
			echo json_encode(['status' => FALSE, 'message' => Message::$emptyFields]);
			exit ;
		}
		if (!Validate::isValidEmail($body['email'])) {
			echo json_encode(['status' => FALSE, 'message' => Message::$invalidEmail]);
			exit ;
		}
		if (!Validate::isValidLogin($body['login'])) {
			echo json_encode(['status' => FALSE, 'message' => Message::$invalidLogin]);
			exit ;
		}
		if (!Validate::isValidPassword($body['password'])) {
			echo json_encode(['status' => FALSE, 'message' => Message::$invalidPassword]);
			exit ;
		}
		Account::sendSignupEmail($body['email'], $body['login'], hash('whirlpool', $body['password']));
	}
	
	public static function signup() {
		if (isset($_GET['email']) && $_GET['email'] !== ''
			&& isset($_GET['login']) && $_GET['login'] !== ''
			&& isset($_GET['hash']) && $_GET['hash'] !== ''
			&& Account::signup(urldecode($_GET['email']), urldecode($_GET['login']), urldecode($_GET['hash'])) === true) {
			SiteMapController::showHome();
		} else {
			SiteMapController::show404();
		}
	}
	
	public static function signin() {
		$body = Utils::getBodyFromJson();
		
		if (!isset($body['login']) || $body['login'] === ''
			|| !isset($body['password']) || $body['password'] === '') {
			echo json_encode(Message::$emptyFields);
			exit ;
		}
		if (Account::signin($body['login'], hash('whirlpool', $body['password'])) === true) {
			echo json_encode('OK');
		} else {
			echo json_encode(Message::$invalidOrInactiveAccount);
		}
	}
	
	public static function signout() {
		unset($_SESSION['auth-data']);
		Route::redirect('/');
	}

	public static function changeEmail() {
		$body = Utils::getBodyFromJson();

		if (!isset($body['email']) || $body['email'] === '') {
			echo json_encode(Message::$emptyFields);
			exit ;
		}
		if (!Validate::isValidEmail($body['email'])) {
			echo json_encode(Message::$invalidEmail);
		} else {
			Account::changeEmail($body['email'], $_SESSION['auth-data']['login']);
		}
	}
	
	public static function changeLogin() {
		$body = Utils::getBodyFromJson();

		if (!isset($body['login']) || $body['login'] === '') {
			echo json_encode(Message::$emptyFields);
			exit ;
		}
		if (!Validate::isValidLogin($body['login'])) {
			echo json_encode(Message::$invalidLogin);
		} else {
			Account::changeLogin($body['login'], $_SESSION['auth-data']['login']);
		}
	}

	public static function tempAccountAccess() {
		if (isset($_GET['email']) && $_GET['email'] !== ''
			&& isset($_GET['hash']) && $_GET['hash'] !== ''
			&& Account::isHashValid(urldecode($_GET['email']), urldecode($_GET['hash']))) {
			Account::cleanHash(urldecode($_GET['email']));
			$_SESSION['auth-data']['email'] = $_GET['email'];
			SiteMapController::showResetPasswordPage();
		} else {
			SiteMapController::show404();
		}
	}
	
	public static function changePassword() {
		$body = Utils::getBodyFromJson();

		if (!isset($body['password']) || $body['password'] === '') {
			echo json_encode(Message::$emptyFields);
			exit ;
		}
		if (!Validate::isValidPassword($body['password'])) {
			echo json_encode(Message::$invalidPassword);
		} else {
			Account::changePassword(hash('whirlpool', $body['password']), $_SESSION['auth-data']['login']);
		}
	}
	
	public static function sendForgotPasswordEmail() {
		$body = Utils::getBodyFromJson();

		if (!isset($body['email']) || $body['email'] === '') {
			echo json_encode(Message::$emptyFields);
			exit ;
		}
		Account::sendForgotPasswordEmail($body['email']);
	}

	public static function resetPassword() {
		$body = Utils::getBodyFromJson();

		if (!isset($body['password']) || $body['password'] === '') {
			echo json_encode(Message::$emptyPassword);
			exit ;
		}
		if (!Validate::isValidPassword($body['password'])) {
			echo json_encode(Message::$invalidPassword);
		} else {
			Account::resetPassword(hash('whirlpool', $body['password']));
		}
	}
	
	public static function isSignedIn() {
		echo json_encode(Account::isSignedIn());
	}
}
