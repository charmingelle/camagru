<?php

require_once(getRoot() . 'app/core/DBConnect.php');

class Photos {
	public static function getPhotos() {
		$result = DBConnect::sendQuery('SELECT `url`, `likes`, `comments` FROM `photo`')->fetchAll();
		
		return $result;
	}

	public static function savePhoto($source) {
		$accountId = DBConnect::sendQuery('SELECT id FROM account WHERE login = :login',
											['login' => $_SESSION['auth-data']['login']])->fetchAll();

		return $accountId;
	}
}
