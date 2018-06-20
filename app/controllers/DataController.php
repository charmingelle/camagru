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
		echo json_encode($_SESSION);

		// $source = file_get_contents('php://input');

		// $accountId = Photos::savePhoto($source);
		// error_log(print_r($accountId, true));
		// echo json_encode($accountId);
	}
}
