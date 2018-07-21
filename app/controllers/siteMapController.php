<?php

class SiteMapController {	
	public static function showHome() {
		Page::show('views/home.html');
	}

	public static function showAccount() {
		Page::show('views/account.html');
	}

	public static function show404() {
		Page::show('views/404.html');
	}

	public static function showResetPasswordPage() {
		Page::show('views/resetPassword.html');
	}
}
