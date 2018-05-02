<?php

require_once(getRoot() . 'app/controllers/AuthController.php');
require_once(getRoot() . 'app/controllers/DataController.php');

class Route {
	private static function _request($controller_name_and_method) {
		$controller_name_and_method_array = explode('@', $controller_name_and_method);
		$controller_name = $controller_name_and_method_array[0];
		$controller_method = $controller_name_and_method_array[1];
		$result = $controller_name::$controller_method();
		return $result;
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
		if (isset($_POST['login']) && $_POST['login'] !== ""
			&& isset($_POST['password']) && $_POST['password'] !== ""
			&& isset($_POST['submit']) && $_POST['submit'] === 'Sign in') {
			self::_request('AuthController@signin');
		}
	}
	
	public static function signout() {
		self::_request('AuthController@signout');
	}
	
	public static function changeEmail() {
		if (isset($_SESSION['login']) && $_SESSION['login'] !== '') {
			require_once(getRoot() . 'views/changeEmail.php');
			if (isset($_POST['email']) && $_POST['email'] !== ""
				&& isset($_POST['submit']) && $_POST['submit'] === 'Submit') {
				self::_request('AuthController@changeEmail');
			}
		} else {
			require_once(getRoot() . 'views/home.php');
		}
	}
	
	public static function changeLogin() {
		if (isset($_SESSION['login']) && $_SESSION['login'] !== '') {
			require_once(getRoot() . 'views/changeLogin.php');
			if (isset($_POST['login']) && $_POST['login'] !== ""
				&& isset($_POST['submit']) && $_POST['submit'] === 'Submit') {
				self::_request('AuthController@changeLogin');
			}
		} else {
			require_once(getRoot() . 'views/home.php');
		}
	}
	
	public static function changePassword() {
		if ($_SERVER['REQUEST_METHOD'] === 'GET'
			&& isset($_GET['login']) && $_GET['login'] !== ''
			&& isset($_GET['hash']) && $_GET['hash'] !== '') {
			$_SESSION['login'] = $_GET['login'];
			require_once(getRoot() . 'views/changePassword.php');
		} else if (isset($_SESSION['login']) && $_SESSION['login'] !== '') {
			require_once(getRoot() . 'views/changePassword.php');
			if (isset($_POST['password']) && $_POST['password'] !== ""
				&& isset($_POST['submit']) && $_POST['submit'] === 'Submit') {
				self::_request('AuthController@changePassword');
			}
		} else {
			require_once(getRoot() . 'views/home.php');
		}
	}
	
	public static function sendResetLink() {
		require_once(getRoot() . 'views/forgotPassword.php');
		if (isset($_POST['email']) && $_POST['email'] !== ""
			&& isset($_POST['submit']) && $_POST['submit'] === 'Get reset password link') {
			self::_request('AuthController@sendResetLink');
		}
	}
	
	public static function getMain() {
		require_once(getRoot() . 'views/main.php');
	}
	
	public static function getPhotos() {
		return json_encode(self::_request('DataController@getPhotos'));
	}
}

if ($_SERVER['REQUEST_URI'] === '/') {
	Route::home();
} else if (explode('?', $_SERVER['REQUEST_URI'], 2)[0] === '/signup') {
	Route::signup();
} else if ($_SERVER['REQUEST_URI'] === '/signin') {
	Route::signin();
} else if ($_SERVER['REQUEST_URI'] === '/signout') {
	Route::signout();
} else if ($_SERVER['REQUEST_URI'] === '/changeEmail') {
	Route::changeEmail();
} else if ($_SERVER['REQUEST_URI'] === '/changeLogin') {
	Route::changeLogin();
} else if (explode('?', $_SERVER['REQUEST_URI'], 2)[0] === '/changePassword') {
	Route::changePassword();
} else if ($_SERVER['REQUEST_URI'] === '/forgotPassword') {
	Route::sendResetLink();
} else if ($_SERVER['REQUEST_URI'] === '/main') {
	Route::getMain();
} else if ($_SERVER['REQUEST_URI'] === '/photos') {
	return Route::getPhotos();
} else if ($_SERVER['REQUEST_URI'] === '/script.js') {
	require_once(getRoot() . 'views/main.php');
}
