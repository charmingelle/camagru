<?php

require_once(getRoot() . 'app/core/DBConnect.php');
require_once(getRoot() . 'app/modules/Auth.php');
require_once(getRoot() . 'app/modules/Page.php');
require_once(getRoot() . 'app/modules/Validate.php');

class AuthController {
	public static function sendVerification() {
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
		if (Auth::signup($_GET['email'], $_GET['hash']) === true) {
			Page::redirect('views/home.php');
		} else {
			Page::redirect('views/signup.php');
		}
	}
	
	public static function signin() {
		if (Auth::signin($_POST['login'], hash('whirlpool', $_POST['password'])) === true) {
			Page::redirect('views/home.php');
		} else {
			Page::redirect('views/invalidOrInactiveAccount.php');
		}
	}
	
	public static function signout() {
		unset($_SESSION['login']);
		Page::redirect('views/home.php');
	}
	
	public static function changeEmail() {
		if (!Validate::isValidEmail($_POST['email'])) {
			Page::redirect('views/invalidEmail.php');
		}
		Auth::changeEmail($_POST['email'], $_SESSION['login']);
	}
	
	public static function changeLogin() {
		if (!Validate::isValidLogin($_POST['login'])) {
			Page::redirect('views/invalidLogin.php');
		}
		Auth::changeLogin($_POST['login'], $_SESSION['login']);
		$_SESSION['login'] = $_POST['login'];
	}
	
	public static function changePassword() {
		if (!Validate::isValidPassword($_POST['password'])) {
			Page::redirect('views/invalidPassword.php');
		}
		Auth::changePassword(hash('whirlpool', $_POST['password']), $_SESSION['login']);
	}
}
