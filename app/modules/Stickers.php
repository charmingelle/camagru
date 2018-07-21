<?php

class Stickers {
	public static function getStickers() {
		return DBConnect::sendQuery('SELECT url FROM sticker')->fetchAll();
	}
}
