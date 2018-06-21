<?php

require_once(getRoot() . 'app/core/DBConnect.php');

class Photos {
	public static function getPhotos() {
		$result = DBConnect::sendQuery('SELECT `url`, `likes`, `comments`, `login` FROM `photo`')->fetchAll();
		
		return $result;
	}

	private static function getUrl() {
		$filename = substr(hash("whirlpool", uniqid() . time()), 0, 16) . '.png';

		return ('photo/' . $filename);
	}

	public static function savePhoto($source) {
		$url = self::getUrl();

		file_put_contents(getRoot() . 'public/' . $url, base64_decode(explode(';base64,', $source)[1]));
		DBConnect::sendQuery('INSERT INTO `photo`(`url`, `likes`, `comments`, `login`) VALUES (:url, 0, 0, :login)',
								['url' => $url, 'login' => $_SESSION['auth-data']['login']]);
	}
}
