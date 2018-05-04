<?php

require_once(getRoot() . 'app/modules/Page.php');

class SiteMapController {
	public static function showHome() {
		Page::show('views/home.php');
	}

	public static function showSignin() {
		Page::show('views/signin.php');
	}

	public static function showChangeEmail() {
		if (!isset($_SESSION['login']) || $_SESSION['login'] === '') {
			exit ;
		}
		Page::show('views/changeEmail.php');
	}

	public static function showChangeLogin() {
		if (!isset($_SESSION['login']) || $_SESSION['login'] === '') {
			exit ;
		}
		Page::show('views/changeLogin.php');
	}

	public static function showForgotPassword() {
		Page::show('views/forgotPassword.php');
	}
}
