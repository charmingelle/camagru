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
}
