<?php

require_once(getRoot() . 'app/core/DBConnect.php');
require_once(getRoot() . 'app/modules/Auth.php');
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
			Auth::sendLink($creds['email'], $creds['login'], hash('whirlpool', $creds['password']));
		}
	}
	
	public static function signup() {
		if (isset($_GET['email']) && $_GET['email'] !== ''
			&& isset($_GET['login']) && $_GET['login'] !== ''
			&& isset($_GET['hash']) && $_GET['hash'] !== ''
			&& Auth::signup(urldecode($_GET['email']), urldecode($_GET['login']), urldecode($_GET['hash'])) === true) {
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
			if (Auth::signin($creds['login'], hash('whirlpool', $creds['password'])) === true) {
				echo json_encode('OK');
			} else {
				echo json_encode(Message::$invalidOrInactiveAccount);
			}
		}
	}
	
	public static function signout() {
		unset($_SESSION['auth-data']);
		SiteMapController::showHome();
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
				Auth::changeEmail($creds['email'], $_SESSION['auth-data']['login']);
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
				Auth::changeLogin($creds['login'], $_SESSION['auth-data']['login']);
			}
		}
	}

	public static function tempAccountAccess() {
		if (isset($_GET['email']) && $_GET['email'] !== ''
			&& isset($_GET['login']) && $_GET['login'] !== ''
			&& isset($_GET['hash']) && $_GET['hash'] !== ''
			&& Auth::isHashValid(urldecode($_GET['email']), urldecode($_GET['login']), urldecode($_GET['hash']))) {
			$_SESSION['auth-data']['login'] = $_GET['login'];
			SiteMapController::showAccount();
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
				Auth::changePassword(hash('whirlpool', $creds['password']), $_SESSION['auth-data']['login']);
			}
		}
	}
	
	public static function sendResetLink() {
		$body = file_get_contents('php://input');
		
		if ($body) {
			$creds = json_decode($body, true);

			if (!isset($creds['email']) || $creds['email'] === '') {
				echo json_encode(Message::$emptyFields);
				exit ;
			}
			Auth::sendResetLink($creds['email']);
		}
	}
	
	public static function isSignedIn() {
		echo json_encode(Auth::isSignedIn());
	}
}
