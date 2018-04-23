<?php

require_once(getRoot() . 'app/core/DBConnect.php');
require_once(getRoot() . 'app/modules/Photos.php');

class DataController {
	public static function getPhotos() {
		return Photos::getPhotos();
	}
}
