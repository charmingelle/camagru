<?php

require_once(getRoot() . 'app/core/DBConnect.php');
require_once(getRoot() . 'app/modules/Photos.php');
require_once(getRoot() . 'app/modules/Stickers.php');

class DataController {
	public static function getPhotos() {
		echo json_encode(Photos::getPhotos());
	}

	public static function getStickers() {
		echo json_encode(Stickers::getStickers());
	}
}
