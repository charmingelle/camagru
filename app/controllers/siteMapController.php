<?php

require_once(getRoot() . 'app/modules/Page.php');

class SiteMapController {
	public static function showHome() {
		Page::redirect('views/home.php');
	}

	public static function showSignin() {
		Page::redirect('views/signin.php');
	}

	public static function showChangeEmail() {
		if (!isset($_SESSION['login']) || $_SESSION['login'] === '') {
			exit ;
		}
		Page::redirect('views/changeEmail.php');
	}

	public static function showChangeLogin() {
		if (!isset($_SESSION['login']) || $_SESSION['login'] === '') {
			exit ;
		}
		Page::redirect('views/changeLogin.php');
	}

	public static function showForgotPassword() {
		Page::redirect('views/forgotPassword.php');
	}
}
