<?php

class Photos {
	public static function getPhotos() {
		$result = DBConnect::sendQuery('SELECT `url`, `likes` FROM `photo`')->fetchAll();
		
		return $result;
	}
}
