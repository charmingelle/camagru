<?php

require_once(getRoot() . 'app/core/DBConnect.php');

class Photos {
	public static function getPhotos() {
		$result = DBConnect::sendQuery('SELECT `id`, `url`, `likes`, `comments`, `login` FROM `photo`')->fetchAll();
		
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

	public static function getUserPictures() {
		return DBConnect::sendQuery('SELECT `id`, `url` FROM `photo` WHERE `login` = :login',
			['login' => $_SESSION['auth-data']['login']])->fetchAll();
	}

	public static function deleteUserPicture($id) {
		$url = DBConnect::sendQuery('SELECT `url` FROM `photo` WHERE `id` = :id',
							['id' => $id])->fetchAll();

		if (!empty($url)) {
			DBConnect::sendQuery('DELETE FROM `photo` WHERE `id` = :id',
								['id' => $id]);
			unlink(getRoot() . 'public/' . $url[0]['url']);
		}
	}

	public static function likePicture($id) {
		DBConnect::sendQuery('UPDATE `photo` SET `likes` = `likes` + 1 WHERE `id` = :id',
							['id' => $id]);
	}

	public static function getLikes($id) {
		$likes = DBConnect::sendQuery('SELECT `likes` FROM `photo` WHERE `id` = :id',
										['id' => $id])->fetchAll();
		
		return ($likes[0]['likes']);
	}
}
