<?php

require_once(getRoot() . 'app/core/DBConnect.php');
require_once(getRoot() . 'app/modules/Account.php');
require_once(getRoot() . 'app/modules/Page.php');
require_once(getRoot() . 'app/modules/Validate.php');

class AuthController {
	public static function sendVerification() {
		$body = file_get_contents('php://input');
		
		if ($body) {
			$creds = json_decode($body, true);
			
			if (!isset($creds['email']) || $creds['email'] === ''
				|| !isset($creds['login']) || $creds['login'] === ''
				|| !isset($creds['password']) || $creds['password'] === '') {
				echo json_encode(Message::$emptyFields);
				exit ;
			}
			if (!Validate::isValidEmail($creds['email'])) {
				echo json_encode(Message::$invalidEmail);
				exit ;
			}
			if (!Validate::isValidLogin($creds['login'])) {
				echo json_encode(Message::$invalidLogin);
				exit ;
			}
			if (!Validate::isValidPassword($creds['password'])) {
				echo json_encode(Message::$invalidPassword);
				exit ;
			}
			Account::sendSignupEmail($creds['email'], $creds['login'], hash('whirlpool', $creds['password']));
		}
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
		$body = file_get_contents('php://input');

		if ($body) {
			$creds = json_decode($body, true);
			
			if (!isset($creds['login']) || $creds['login'] === ''
				|| !isset($creds['password']) || $creds['password'] === '') {
				echo json_encode(Message::$emptyFields);
				exit ;
			}
			if (Account::signin($creds['login'], hash('whirlpool', $creds['password'])) === true) {
				echo json_encode('OK');
			} else {
				echo json_encode(Message::$invalidOrInactiveAccount);
			}
		}
	}
	
	public static function signout() {
		unset($_SESSION['auth-data']);
		Route::redirect('/');
	}

	public static function changeEmail() {
		$body = file_get_contents('php://input');
		
		if ($body) {
			$creds = json_decode($body, true);

			if (!isset($creds['email']) || $creds['email'] === '') {
				echo json_encode(Message::$emptyFields);
				exit ;
			}
			if (!Validate::isValidEmail($creds['email'])) {
				echo json_encode(Message::$invalidEmail);
			} else {
				Account::changeEmail($creds['email'], $_SESSION['auth-data']['login']);
			}
		}
	}
	
	public static function changeLogin() {
		$body = file_get_contents('php://input');
		
		if ($body) {
			$creds = json_decode($body, true);

			if (!isset($creds['login']) || $creds['login'] === '') {
				echo json_encode(Message::$emptyFields);
				exit ;
			}
			if (!Validate::isValidLogin($creds['login'])) {
				echo json_encode(Message::$invalidLogin);
			} else {
				Account::changeLogin($creds['login'], $_SESSION['auth-data']['login']);
			}
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
		$body = file_get_contents('php://input');
		
		if ($body) {
			$creds = json_decode($body, true);

			if (!isset($creds['password']) || $creds['password'] === '') {
				echo json_encode(Message::$emptyFields);
				exit ;
			}
			if (!Validate::isValidPassword($creds['password'])) {
				echo json_encode(Message::$invalidPassword);
			} else {
				Account::changePassword(hash('whirlpool', $creds['password']), $_SESSION['auth-data']['login']);
			}
		}
	}
	
	public static function sendForgotPasswordEmail() {
		$body = file_get_contents('php://input');
		
		if ($body) {
			$creds = json_decode($body, true);

			if (!isset($creds['email']) || $creds['email'] === '') {
				echo json_encode(Message::$emptyFields);
				exit ;
			}
			Account::sendForgotPasswordEmail($creds['email']);
		}
	}

	public static function resetPassword() {
		$body = file_get_contents('php://input');
		
		if ($body) {
			$creds = json_decode($body, true);

			if (!isset($creds['password']) || $creds['password'] === '') {
				echo json_encode(Message::$emptyPassword);
				exit ;
			}
			if (!Validate::isValidPassword($creds['password'])) {
				echo json_encode(Message::$invalidPassword);
			} else {
				Account::resetPassword(hash('whirlpool', $creds['password']));
			}
		}
	}
	
	public static function isSignedIn() {
		echo json_encode(Account::isSignedIn());
	}
}
