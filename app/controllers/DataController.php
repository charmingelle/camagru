<?php

require_once(getRoot() . 'app/core/DBConnect.php');
require_once(getRoot() . 'app/modules/Photos.php');

class DataController {
	public static function getPhotos() {
		$to_check = json_encode(Photos::getPhotos());

		echo $to_check;
		return $to_check;
	}
}
