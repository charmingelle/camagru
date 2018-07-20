<?php

require_once(getRoot() . 'app/core/DBConnect.php');

class Photos {
	public static function getPhotos($lastId) {
		return DBConnect::sendQuery('SELECT id, url, likes, comments, login FROM photo WHERE private = FALSE AND id <= :lastId ORDER BY ID DESC LIMIT 5',
									['lastId' => $lastId])->fetchAll();
	}

	private static function getUrl() {
		return 'photo/' . substr(hash("whirlpool", uniqid() . time()), 0, 16) . '.png';
	}

	public static function savePhoto($layers) {
		$url = self::getUrl();
		$photo = imagecreatefromstring(base64_decode(explode(';base64,', $layers[0]['source'])[1]));
		
		array_shift($layers);
		foreach ($layers as $layer) {
			$sticker = imagecreatefromstring(base64_decode(explode(';base64,', $layer['source'])[1]));
			
			imagecopy($photo, $sticker, $layer['left'], $layer['top'], 0, 0, $layer['width'], $layer['height']);
		}
		imagejpeg($photo, getRoot() . 'public/' . $url, 100);
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
	
	public static function getPhotoPrivate($id) {
		$private = DBConnect::sendQuery('SELECT `private` FROM `photo` WHERE `id` = :id',
										['id' => $id])->fetchAll();
		
		return $private[0]['private'];
	}
	
	public static function publish($id) {
		DBConnect::sendQuery('UPDATE `photo` SET `private` = NOT `private` WHERE `id` = :id',
							['id' => $id]);
	}

	public static function likePicture($id) {
		DBConnect::sendQuery('UPDATE `photo` SET `likes` = `likes` + 1 WHERE `id` = :id',
							['id' => $id]);
	}

	public static function getLikes($id) {
		$likes = DBConnect::sendQuery('SELECT `likes` FROM `photo` WHERE `id` = :id',
										['id' => $id])->fetchAll();
		
		return $likes[0]['likes'];
	}

	public static function addComment($comment, $photoId) {
		DBConnect::sendQuery('INSERT INTO `comment`(`comment`, `photo_id`, `login`) VALUES (:comment, :photoId, :login)',
							['comment' => $comment, 'photoId' => $photoId, 'login' => $_SESSION['auth-data']['login']]);
	}

	public static function increaseCommentCount($id) {
		DBConnect::sendQuery('UPDATE `photo` SET `comments` = `comments` + 1 WHERE `id` = :id',
							['id' => $id]);

		$comments = DBConnect::sendQuery('SELECT `comments` FROM `photo` WHERE `id` = :id',
									['id' => $id])->fetchAll();

		return $comments[0]['comments'];
	}

	public static function getComments($id) {
		return DBConnect::sendQuery('SELECT `login`, `comment` FROM `comment` WHERE `photo_id` = :photoId',
									['photoId' => $id])->fetchAll();
	}
	
	public static function getAuthor($id) {
		$author = DBConnect::sendQuery('SELECT Login FROM photo WHERE id = :id',
										['id' => $id])->fetchAll();
										
		return $author[0]['login'];
	}

	public static function getLastPublicPhotoId() {
		$id = DBConnect::sendQuery('SELECT id FROM photo WHERE private = FALSE ORDER BY id DESC LIMIT 1')->fetchAll();

		return $id[0]['id'];
	}
}
