<?php

class Page {
	public static function show($url) {
		require_once(getRoot() . $url);
		exit;
	}
}
