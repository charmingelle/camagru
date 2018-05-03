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
			Page::redirect('views/invalidEmail.php');
		}
		if (!Validate::isValidLogin($_POST['login'])) {
			Page::redirect('views/invalidLogin.php');
		}
		if (!Validate::isValidPassword($_POST['password'])) {
			Page::redirect('views/invalidPassword.php');
		}
		Auth::sendLink($_POST['email'], $_POST['login'], hash('whirlpool', $_POST['password']));
	}
	
	public static function signup() {
		if (isset($_GET['email']) && $_GET['email'] !== ''
			&& isset($_GET['hash']) && $_GET['hash'] !== ''
			&& Auth::signup($_GET['email'], $_GET['hash']) === true) {
			Page::redirect('views/home.php');
		} else {
			Page::redirect('views/signup.php');
		}
	}
	
	public static function signin() {
		if (!isset($_POST['login']) || $_POST['login'] === ''
			|| !isset($_POST['password']) || $_POST['password'] === ''
			|| !isset($_POST['submit']) || $_POST['submit'] !== 'Sign in') {
			exit ;
		}
		if (Auth::signin($_POST['login'], hash('whirlpool', $_POST['password'])) === true) {
			Page::redirect('views/home.php');
		} else {
			Page::redirect('views/invalidOrInactiveAccount.php');
		}
	}
	
	public static function signout() {
		echo 'here';
		unset($_SESSION['login']);
		Page::redirect('views/home.php');
	}

	public static function changeEmail() {
		if (!isset($_POST['email']) || $_POST['email'] === ''
			|| isset($_POST['submit']) || $_POST['submit'] !== 'Submit') {
			exit ;
		}
		if (!Validate::isValidEmail($_POST['email'])) {
			Page::redirect('views/invalidEmail.php');
		}
		Auth::changeEmail($_POST['email'], $_SESSION['login']);
	}
	
	public static function changeLogin() {
		if (!isset($_POST['login']) || $_POST['login'] === ''
			|| isset($_POST['submit']) || $_POST['submit'] !== 'Submit') {
			exit ;
		}
		if (!Validate::isValidLogin($_POST['login'])) {
			Page::redirect('views/invalidLogin.php');
		}
		Auth::changeLogin($_POST['login'], $_SESSION['login']);
		$_SESSION['login'] = $_POST['login'];
	}

	public static function displayChangePassword() {
		if (isset($_SESSION['login']) && $_SESSION['login'] !== '') {
			Page::redirect('views/changePassword.php');
		} else if ($_SERVER['REQUEST_METHOD'] === 'GET'
			&& isset($_GET['login']) && $_GET['login'] !== ''
			&& isset($_GET['hash']) && $_GET['hash'] !== '') {
			$_SESSION['login'] = $_GET['login'];
			Page::redirect('views/changePassword.php');
		}
	}
	
	public static function changePassword() {
		if (isset($_SESSION['login']) && $_SESSION['login'] !== '') {
			Page::redirect('views/changePassword.php');
			if (!isset($_POST['password']) || $_POST['password'] === ''
				|| !isset($_POST['submit']) || $_POST['submit'] !== 'Submit') {
				exit ;
			}
			if (!Validate::isValidPassword($_POST['password'])) {
				Page::redirect('views/invalidPassword.php');
			}
			Auth::changePassword(hash('whirlpool', $_POST['password']), $_SESSION['login']);
		}
	}
	
	public static function sendResetLink() {
		if (!isset($_POST['email']) || $_POST['email'] === ''
			|| !isset($_POST['submit']) || $_POST['submit'] !== 'Get reset password link') {
			exit ;
		}
		if (Auth::sendResetLink($_POST['email']) === false) {
			Page::redirect('views/invalidEmail.php');
		}
	}
}
