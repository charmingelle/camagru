<?php

class Photos {
	public static function getPhotos() {
		$result = DBConnect::sendQuery('SELECT `url`, `likes`, `comments` FROM `photo`')->fetchAll();
		
		return $result;
	}
}
