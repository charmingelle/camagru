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
		if (isset($_SESSION['auth-data']['login']) && $_SESSION['auth-data']['login'] !== '') {
			Page::show('views/changeEmail.php');
		} else {
			Route::redirect('/');
		}
	}

	public static function showChangeLogin() {
		if (isset($_SESSION['auth-data']['login']) && $_SESSION['auth-data']['login'] !== '') {
			Page::show('views/changeLogin.php');
		} else {
			Route::redirect('/');
		}
	}

	public static function showForgotPassword() {
		Page::show('views/forgotPassword.php');
	}

	public static function showAccount() {
		if (isset($_SESSION['auth-data']['login']) && $_SESSION['auth-data']['login'] !== '') {
			Page::show('views/account.php');
		} else {
			Route::redirect('/');
		}
	}
}
