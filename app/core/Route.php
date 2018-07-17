<?php

require_once(getRoot() . 'app/controllers/SiteMapController.php');

class Route {
	private static function _getControllerName($controller_name_and_method) {
		return explode('@', $controller_name_and_method)[0];
	}

	private static function _getControllerMethod($controller_name_and_method) {
		return explode('@', $controller_name_and_method)[1];
	}

	private static function _isTrueCondition($condition) {
		if ($condition === 'signed in') {
			if (isset($_SESSION['auth-data']['login']) && $_SESSION['auth-data']['login'] !== '') {
				return true;
			}
			return false;
		} else if ($condition === 'not signed in') {
			if (!isset($_SESSION['auth-data']['login']) || $_SESSION['auth-data']['login'] === '') {
				return true;
			}
			return false;
		} else if ($condition === 'emailed') {
			if (!isset($_SESSION['auth-data']['email']) || $_SESSION['auth-data']['email'] === '') {
				return true;
			}
			return false;
		}
		return false;
	}

	public static function get(array $params) {
		$url = parse_url($_SERVER['REQUEST_URI'])['path'];
		$controller_name = self::_getControllerName($params['controller']);
		$controller_method = self::_getControllerMethod($params['controller']);

		if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
			return ;
		}
		if ($url === $params['uri']) {
			if (!isset($params['condition']) || self::_isTrueCondition($params['condition'])) {
				return $controller_name::$controller_method();
			} else {
				Route::redirect('/');
			}
		}
	}
	
	public static function post(array $params) {
		$url = parse_url($_SERVER['REQUEST_URI'])['path'];
		$controller_name = self::_getControllerName($params['controller']);
		$controller_method = self::_getControllerMethod($params['controller']);

		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			return ;
		}
		if ($url === $params['uri']) {
			if (!isset($params['condition']) || self::_isTrueCondition($params['condition'])) {
				return $controller_name::$controller_method();
			} else {
				Route::redirect('/');
			}
		}
	}

	// public static function get($uri, $controller_name_and_method) {
	// 	$url = parse_url($_SERVER['REQUEST_URI'])['path'];
	// 	$controller_name = self::_getControllerName($controller_name_and_method);
	// 	$controller_method = self::_getControllerMethod($controller_name_and_method);

	// 	if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
	// 		return ;
	// 	}
	// 	if ($url === $uri) {
	// 		return $controller_name::$controller_method();
	// 	}
	// }
	
	// public static function post($uri, $controller_name_and_method) {
	// 	$url = parse_url($_SERVER['REQUEST_URI'])['path'];
	// 	$controller_name = self::_getControllerName($controller_name_and_method);
	// 	$controller_method = self::_getControllerMethod($controller_name_and_method);

	// 	if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	// 		return ;
	// 	}
	// 	if ($url === $uri) {
	// 		return $controller_name::$controller_method();
	// 	}
	// }

	public static function redirect($uri) {
		header('Location: http://' . $_SERVER['HTTP_HOST'] . $uri);
	}
}
