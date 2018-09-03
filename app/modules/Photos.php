<?php

class Photos {
	public static function getPhotos($lastId) {
		$limit = 5;

		return DBConnect::sendQuery('SELECT id, url, likes, comments, login FROM photo WHERE private = FALSE AND id <= :lastId ORDER BY ID DESC LIMIT :limit',
									['lastId' => $lastId, 'limit' => $limit])->fetchAll();
	}

	private static function getUrl() {
		return 'photo/' . substr(hash("whirlpool", uniqid() . time()), 0, 16) . '.png';
	}

	public static function savePhoto($layers) {
		$url = self::getUrl();
		$photo = imagecreatefromstring(base64_decode(explode(';base64,', $layers[0]['source'])[1]));

		array_shift($layers);
		foreach ($layers as $layer) {
			if ($layer['type'] == 'file') {
				$sticker = imagecreatefromstring(file_get_contents(getRoot() . 'public/' . parse_url($layer['source'])['path']));
			} else if ($layer['type'] == 'string') {
				$sticker = imagecreatefromstring(base64_decode(explode(';base64,', $layer['source'])[1]));
			}

			imagecopyresampled($photo, $sticker, $layer['left'], $layer['top'], 0, 0, $layer['width'], $layer['height'], imagesx($sticker), imagesy($sticker));
		}
		imagejpeg($photo, getRoot() . 'public/' . $url, 100);
		DBConnect::sendQuery('INSERT INTO photo(url, likes, comments, login) VALUES (:url, 0, 0, :login)',
							['url' => $url, 'login' => $_SESSION['auth-data']['login']]);
	}

	public static function getUserPhoto() {
		return DBConnect::sendQuery('SELECT id, url FROM photo WHERE login = :login',
			['login' => $_SESSION['auth-data']['login']])->fetchAll();
	}

	public static function deleteUserPhoto($id) {
		$url = DBConnect::sendQuery('SELECT url FROM photo WHERE id = :id AND login = :login',
							['id' => $id, 'login' => $_SESSION['auth-data']['login']])->fetchAll();

		if (!empty($url)) {
			DBConnect::sendQuery('DELETE FROM photo WHERE id = :id',
								['id' => $id]);
			unlink(getRoot() . 'public/' . $url[0]['url']);
		}
	}
	
	public static function getPhotoPrivate($id) {
		return DBConnect::sendQuery('SELECT private FROM photo WHERE id = :id',
										['id' => $id])->fetchAll()[0]['private'];
	}
	
	public static function publish($id) {
		DBConnect::sendQuery('UPDATE photo SET private = NOT private WHERE id = :id AND login = :login',
							['id' => $id, 'login' => $_SESSION['auth-data']['login']]);
	}

	private static function _getLikeStatus($id) {
		$query_result = DBConnect::sendQuery('SELECT * FROM likes WHERE photo_id = :photoId AND login = :login',
											['photoId' => $id, 'login' => $_SESSION['auth-data']['login']])->fetchAll();

		if (empty($query_result)) {
			return false;
		}
		return true;
	}

	public static function getLikeStatus($id) {
		echo json_encode(self::_getLikeStatus($id));
	}
	
	public static function getLikes($id) {
		return DBConnect::sendQuery('SELECT likes FROM photo WHERE id = :id',
										['id' => $id])->fetchAll()[0]['likes'];
	}
	
	private static function _dislike($id) {
		DBConnect::sendQuery('UPDATE photo SET likes = likes - 1 WHERE id = :id',
							['id' => $id]);
	}

	private static function _deleteLikeStatus($id) {
		DBConnect::sendQuery('DELETE FROM likes WHERE photo_id = :id AND login = :login',
							['id' => $id, 'login' => $_SESSION['auth-data']['login']]);
	}

	private static function _like($id) {
		DBConnect::sendQuery('UPDATE photo SET likes = likes + 1 WHERE id = :id',
							['id' => $id]);
	}
	
	private static function _addLikeStatus($id) {
		DBConnect::sendQuery('INSERT INTO likes(photo_id, login) VALUES (:id, :login)',
							['id' => $id, 'login' => $_SESSION['auth-data']['login']]);
	}

	public static function likeDislike($id) {
		if (self::_getLikeStatus($id)) {
			self::_dislike($id);
			self::_deleteLikeStatus($id);
		} else {
			self::_like($id);
			self::_addLikeStatus($id);
		}
	}

	public static function addComment($comment, $photoId) {
		DBConnect::sendQuery('INSERT INTO comment(comment, photo_id, login) VALUES (:comment, :photoId, :login)',
							['comment' => $comment, 'photoId' => $photoId, 'login' => $_SESSION['auth-data']['login']]);
	}

	private static function _getCommentCount($id) {
		return DBConnect::sendQuery('SELECT comments FROM photo WHERE id = :id',
									['id' => $id])->fetchAll()[0]['comments'];
	}

	public static function increaseCommentCount($id) {
		DBConnect::sendQuery('UPDATE photo SET comments = comments + 1 WHERE id = :id',
							['id' => $id]);
		return self::_getCommentCount($id);
	}

	public static function decreaseCommentCount($id) {
		DBConnect::sendQuery('UPDATE photo SET comments = comments - 1 WHERE id = :id',
							['id' => $id]);
		return self::_getCommentCount($id);
	}
	
	public static function getAuthor($id) {
		return DBConnect::sendQuery('SELECT login FROM photo WHERE id = :id',
										['id' => $id])->fetchAll()[0]['login'];
	}

	public static function getLastPublicPhotoId() {
		$query_result = DBConnect::sendQuery('SELECT id FROM photo WHERE private = FALSE ORDER BY id DESC LIMIT 1')->fetchAll();

		if ($query_result) {
			return $query_result[0]['id'];
		}
		return [];
	}
}
