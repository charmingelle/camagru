<?php

require_once(getRoot() . 'app/core/DBConnect.php');
require_once(getRoot() . 'app/modules/Auth.php');
require_once(getRoot() . 'app/modules/Page.php');
require_once(getRoot() . 'app/modules/Validate.php');

class AuthController {
	public static function signup() {
		if (!Validate::isValidEmail($_POST['email'])) {
			Page::redirect('views/invalidEmail.php');
		}
		if (!Validate::isValidLogin($_POST['login'])) {
			Page::redirect('views/invalidLogin.php');
		}
		if (!Validate::isValidPassword($_POST['password'])) {
			Page::redirect('views/invalidPassword.php');
		}
		if (Auth::signup($_POST['email'], $_POST['login'], hash('whirlpool', $_POST['password'])) === true) {
			Page::redirect('views/home.php');
		} else {
			Page::redirect('views/signup.php');
		}
	}
	
	public static function signin() {
		if (Auth::signin($_POST['login'], hash('whirlpool', $_POST['password'])) === true) {
			Page::redirect('views/home.php');
		} else {
			Page::redirect('views/signin.php');
		}
	}
	
	public static function signout() {
		unset($_SESSION['login']);
	}
}
