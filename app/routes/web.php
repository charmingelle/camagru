<?php

require_once(getRoot() . 'app/controllers/AuthController.php');
require_once(getRoot() . 'app/controllers/DataController.php');
require_once(getRoot() . 'app/controllers/SiteMapController.php');

class Route {
	private static function _getControllerName($controller_name_and_method) {
		return explode('@', $controller_name_and_method)[0];
	}

	private static function _getControllerMethod($controller_name_and_method) {
		return explode('@', $controller_name_and_method)[1];
	}

	public static function get($uri, $controller_name_and_method) {
		$url = parse_url($_SERVER['REQUEST_URI'])['path'];
		$controller_name = self::_getControllerName($controller_name_and_method);
		$controller_method = self::_getControllerMethod($controller_name_and_method);

		if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
			return ;
		}
		if ($url === $uri) {
			return $controller_name::$controller_method();
		}
	}
	
	public static function post($uri, $controller_name_and_method) {
		$url = parse_url($_SERVER['REQUEST_URI'])['path'];
		$controller_name = self::_getControllerName($controller_name_and_method);
		$controller_method = self::_getControllerMethod($controller_name_and_method);

		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			return ;
		}
		if ($url === $uri) {
			return $controller_name::$controller_method();
		}
	}
}

Route::get('/', 'SiteMapController@showHome');

Route::get('/signup', 'AuthController@signup');
Route::post('/signup', 'AuthController@sendVerification');

Route::get('/signin', 'SiteMapController@showSignin');
Route::post('/signin', 'AuthController@signin');

Route::get('/signout', 'AuthController@signout');

Route::get('/changeEmail', 'SiteMapController@showChangeEmail');
Route::post('/changeEmail', 'AuthController@changeEmail');

Route::get('/changeLogin', 'SiteMapController@showChangeLogin');
Route::post('/changeLogin', 'AuthController@changeLogin');

Route::get('/changePassword', 'AuthController@displayChangePassword');
Route::post('/changePassword', 'AuthController@changePassword');

Route::get('/forgotPassword', 'SiteMapController@showForgotPassword');
Route::post('/forgotPassword', 'AuthController@sendResetLink');

Route::post('/photos', 'DataController@getPhotos');
