<?php

require_once(getRoot() . 'app/modules/Photos.php');
require_once(getRoot() . 'app/modules/Stickers.php');

class DataController {
	public static function getPhotos() {
		$data = file_get_contents('php://input');
		
		if ($data !== FALSE) {
			$data = json_decode($data, TRUE);
			echo json_encode(Photos::getPhotos($data['lastId']));
		}
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
		$data = file_get_contents('php://input');

		if ($data !== FALSE) {
			$data = json_decode($data, TRUE);
			$login = Photos::getAuthor($data['photo-id']);
			
			Photos::addComment($data['comment'], $data['photo-id']);
			if (Account::getNotification($data['login'])) {
				Account::notify($login, $data['comment'], $_SESSION['auth-data']['login']);
			}
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
