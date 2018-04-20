<?php

require_once(getRoot() . 'app/controllers/AuthController.php');

class Route {
	private static function _request($controller_name_and_method) {
		$controller_name_and_method_array = explode('@', $controller_name_and_method);
		$controller_name = $controller_name_and_method_array[0];
		$controller_method = $controller_name_and_method_array[1];
		
		$controller_name::$controller_method();
	}
	
	public static function home() {
		require_once(getRoot() . 'views/home.php');
	}
	
	public static function signup() {
		require_once(getRoot() . 'views/signup.php');
		if ($_SERVER['REQUEST_METHOD'] === 'POST'
			&& isset($_POST['email']) && $_POST['email'] !== ""
			&& isset($_POST['login']) && $_POST['login'] !== ""
			&& isset($_POST['password']) && $_POST['password'] !== ""
			&& isset($_POST['submit']) && $_POST['submit'] === 'Sign up') {
			self::_request('AuthController@sendVerification');
		} else if ($_SERVER['REQUEST_METHOD'] === 'GET'
				&& isset($_GET['email']) && $_GET['email'] !== ''
				&& isset($_GET['hash']) && $_GET['hash'] !== '') {
			self::_request('AuthController@signup');
		}
	}
	
	public static function signin() {
		require_once(getRoot() . 'views/signin.php');
		if ($_SERVER['REQUEST_METHOD'] === 'POST'
			&& isset($_POST['login']) && $_POST['login'] !== ""
			&& isset($_POST['password']) && $_POST['password'] !== ""
			&& isset($_POST['submit']) && $_POST['submit'] === 'Sign in') {
			self::_request('AuthController@signin');
		}
	}
	
	public static function signout() {
		self::_request('AuthController@signout');
	}
}

if ($_SERVER['REQUEST_URI'] === '/') {
	Route::home();
} else if ($_SERVER['REQUEST_URI'] === '/signup') {
	Route::signup();
} else if ($_SERVER['REQUEST_URI'] === '/signin') {
	Route::signin();
} else if ($_SERVER['REQUEST_URI'] === '/signout') {
	Route::signout();
}
