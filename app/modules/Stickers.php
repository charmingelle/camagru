<?php

class Stickers {
	public static function getStickers() {
		$result = DBConnect::sendQuery('SELECT `url` FROM `sticker`')->fetchAll();

		return $result;
	}
}
