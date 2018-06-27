<?php

require_once(getRoot() . 'app/modules/Photos.php');
require_once(getRoot() . 'app/modules/Stickers.php');

class DataController {
	public static function getPhotos() {
		echo json_encode(Photos::getPhotos());
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
			Photos::addComment($data['comment'], $data['photo-id']);
		}
	}

	public static function getComments() {
		$id = file_get_contents('php://input');
		
		if ($id !== FALSE) {
			echo json_encode(Photos::getComments($id));
		}
	}
}
