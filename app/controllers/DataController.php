<?php

require_once(getRoot() . 'app/controllers/Utils.php');
require_once(getRoot() . 'app/modules/Photos.php');
require_once(getRoot() . 'app/modules/Stickers.php');

class DataController {
	public static function getPhotos() {
		$body = Utils::getBodyFromJson();

		echo json_encode(Photos::getPhotos($body['lastId']));
	}
	
	public static function getLogin() {
		echo json_encode($_SESSION['auth-data']['login']);
	}

	public static function getStickers() {
		echo json_encode(Stickers::getStickers());
	}

	public static function savePicture() {
		$source = file_get_contents('php://input');
		
		if ($source !== FALSE) {
			Photos::savePhoto($source);
		}
	}

	public static function getUserPictures() {
		echo json_encode(Photos::getUserPictures());
	}

	public static function deleteUserPicture() {
		$id = file_get_contents('php://input');

		if ($id !== FALSE) {
			Photos::deleteUserPicture($id);
		}
	}
	
	public static function getPhotoPrivate() {
		$id = file_get_contents('php://input');

		if ($id !== FALSE) {
			echo json_encode(Photos::getPhotoPrivate($id));
		}
	}
	
	public static function publish() {
		$id = file_get_contents('php://input');

		if ($id !== FALSE) {
			Photos::publish($id);
		}
	}

	public static function likePicture() {
		$id = file_get_contents('php://input');

		if ($id !== FALSE) {
			Photos::likePicture($id);
		}
	}

	public static function getLikes() {
		$id = file_get_contents('php://input');
		
		if ($id !== FALSE) {
			echo json_encode(Photos::getLikes($id));
		}
	}

	public static function addComment() {
		$body = Utils::getBodyFromJson();
		$login = Photos::getAuthor($body['photo-id']);
		
		Photos::addComment($body['comment'], $body['photo-id']);
		if (Account::getNotification($body['login'])) {
			Account::notify($login, $body['comment'], $_SESSION['auth-data']['login']);
		}
	}

	public static function increaseCommentCount() {
		$id = file_get_contents('php://input');
		
		if ($id !== FALSE) {
			echo json_encode(Photos::increaseCommentCount($id));
		}
	}

	public static function getComments() {
		$id = file_get_contents('php://input');
		
		if ($id !== FALSE) {
			echo json_encode(Photos::getComments($id));
		}
	}

	public static function getNotification() {
		echo json_encode(Account::getNotification($_SESSION['auth-data']['login']));
	}

	public static function changeNotification() {
		Account::changeNotification();
	}

	public static function getLastPublicPhotoId() {
		echo json_encode(Photos::getLastPublicPhotoId());
	}
}
