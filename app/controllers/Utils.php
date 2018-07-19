<?php

class Utils {
	public static function getBodyFromJson() {
		$body = file_get_contents('php://input');
		
		if ($body === FALSE) {
			exit ;
		}
		return json_decode($body, true);
	}
}
