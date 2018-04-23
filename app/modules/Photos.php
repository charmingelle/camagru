<?php

class Photos {
	private static function _getUrl($elem) {
		return $elem['url'];
	}
	
	public static function getPhotos() {
		$result = DBConnect::sendQuery('SELECT url FROM photo', array());
		
		return array_map('self::_getUrl', $result);
	}
}
