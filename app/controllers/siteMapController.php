<?php

require_once(getRoot() . 'app/modules/Page.php');

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
}
