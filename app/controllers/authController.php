<?php

require_once(getRoot() . 'app/core/DBConnect.php');
require_once(getRoot() . 'app/modules/Auth.php');
require_once(getRoot() . 'app/modules/Page.php');
require_once(getRoot() . 'app/modules/Validate.php');

class AuthController {
	public static function sendVerification() {
		if (!isset($_POST['email']) || $_POST['email'] === ''
			|| !isset($_POST['login']) || $_POST['login'] === ''
			|| !isset($_POST['password']) || $_POST['password'] === ''
			|| !isset($_POST['submit']) || $_POST['submit'] !== 'Sign up') {
			exit ;
		}
		if (!Validate::isValidEmail($_POST['email'])) {
			$_SESSION['auth-data']['change-status'] = Message::$invalidEmail;
		}
		if (!Validate::isValidLogin($_POST['login'])) {
			$_SESSION['auth-data']['change-status'] = Message::$invalidLogin;
		}
		if (!Validate::isValidPassword($_POST['password'])) {
			$_SESSION['auth-data']['change-status'] = Message::$invalidPassword;
		}
		Auth::sendLink($_POST['email'], $_POST['login'], hash('whirlpool', $_POST['password']));
	}
	
	public static function signup() {
		if (isset($_GET['email']) && $_GET['email'] !== ''
			&& isset($_GET['hash']) && $_GET['hash'] !== ''
			&& Auth::signup($_GET['email'], $_GET['hash']) === true) {
			Route::redirect('/');
		} else {
			Page::show('views/signup.php');
		}
	}
	
	public static function signin() {
		if (!isset($_POST['login']) || $_POST['login'] === ''
			|| !isset($_POST['password']) || $_POST['password'] === ''
			|| !isset($_POST['submit']) || $_POST['submit'] !== 'Sign in') {
			exit ;
		}
		if (Auth::signin($_POST['login'], hash('whirlpool', $_POST['password'])) === true) {
			Route::redirect('/');
		} else {
			Page::show('views/invalidOrInactiveAccount.php');
		}
	}
	
	public static function signout() {
		unset($_SESSION['auth-data']);
		Route::redirect('/');
	}

	public static function changeEmail() {
		if (!isset($_POST['email']) || $_POST['email'] === ''
		|| !isset($_POST['submit']) || $_POST['submit'] !== 'Submit') {
			exit ;
		}
		if (!Validate::isValidEmail($_POST['email'])) {
			$_SESSION['auth-data']['change-status'] = Message::$invalidEmail;
		}
		Auth::changeEmail($_POST['email'], $_SESSION['auth-data']['login']);
		Route::redirect('/account');
	}
	
	public static function changeLogin() {
		if (!isset($_POST['login']) || $_POST['login'] === ''
			|| !isset($_POST['submit']) || $_POST['submit'] !== 'Submit') {
			exit ;
		}
		if (!Validate::isValidLogin($_POST['login'])) {
			$_SESSION['auth-data']['change-status'] = Message::$invalidLogin;
		}
		Auth::changeLogin($_POST['login'], $_SESSION['auth-data']['login']);
		$_SESSION['auth-data']['login'] = $_POST['login'];
		Route::redirect('/account');
	}

	public static function showChangePassword() {
		if (isset($_SESSION['auth-data']['login']) && $_SESSION['auth-data']['login'] !== '') {
			Page::show('views/changePassword.php');
		} else if ($_SERVER['REQUEST_METHOD'] === 'GET'
			&& isset($_GET['login']) && $_GET['login'] !== ''
			&& isset($_GET['hash']) && $_GET['hash'] !== '') {
			$_SESSION['auth-data']['login'] = $_GET['login'];
			Page::show('views/changePassword.php');
		} else {
			Route::redirect('/account');
		}
	}
	
	public static function changePassword() {
		if (!isset($_SESSION['auth-data']['login']) || $_SESSION['auth-data']['login'] === '' ||
			!isset($_POST['password']) || $_POST['password'] === ''
		|| !isset($_POST['submit']) || $_POST['submit'] !== 'Submit') {
			exit ;
		}
		if (!Validate::isValidPassword($_POST['password'])) {
			$_SESSION['auth-data']['change-status'] = Message::$invalidPassword;
		}
		Auth::changePassword(hash('whirlpool', $_POST['password']), $_SESSION['auth-data']['login']);
		Route::redirect('/account');
	}
	
	public static function sendResetLink() {
		if (!isset($_POST['email']) || $_POST['email'] === ''
			|| !isset($_POST['submit']) || $_POST['submit'] !== 'Get reset password link') {
			exit ;
		}
		if (Auth::sendResetLink($_POST['email']) === false) {
			$_SESSION['auth-data']['change-status'] = Message::$invalidEmail;
		}
	}
}
