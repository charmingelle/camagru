<?php

class Page {
	public static function redirect($url) {
		require_once(getRoot() . $url);
		exit;
	}
}
