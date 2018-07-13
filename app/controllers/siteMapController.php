<?php

require_once(getRoot() . 'app/modules/Page.php');

class SiteMapController {	
	public static function showHome() {
		Page::show('views/home.html');
	}

	public static function showSignin() {
		Page::show('views/signin.php');
	}

	public static function showChangeEmail() {
		Page::show('views/changeEmail.php');
	}

	public static function showChangeLogin() {
		Page::show('views/changeLogin.php');
	}

	public static function showForgotPassword() {
		Page::show('views/forgotPassword.php');
	}

	public static function showAccount() {
		Page::show('views/account.html');
	}

	public static function show404() {
		Page::show('views/404.php');
	}
	
	// public static function test() {
	// 	if (rand(0, 1) < 0.5) {
	// 		http_response_code(400);
	// 		echo json_encode('error');
	// 	} else {
	// 		http_response_code(200);
	// 		echo json_encode('home');
	// 	}
	// }
}
