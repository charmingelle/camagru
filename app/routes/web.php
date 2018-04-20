<?php

require_once(getRoot() . 'app/controllers/AuthController.php');

class Route {
	public static function post($controller_name_and_method) {
		$controller_name_and_method_array = explode('@', $controller_name_and_method);
		$controller_name = $controller_name_and_method_array[0];
		$controller_method = $controller_name_and_method_array[1];
		
		$controller_name::$controller_method();
	}
}

if ($_SERVER['REQUEST_URI'] === '/') {
	require_once(getRoot() . 'views/home.php');
} else if ($_SERVER['REQUEST_URI'] === '/signup') {
	require_once(getRoot() . 'views/signup.php');
	if (isset($_POST['email']) && $_POST['email'] !== ""
		&& isset($_POST['login']) && $_POST['login'] !== ""
		&& isset($_POST['password']) && $_POST['password'] !== ""
		&& isset($_POST['submit']) && $_POST['submit'] === 'Sign up') {
		Route::post('AuthController@signup');
	}
} else if ($_SERVER['REQUEST_URI'] === '/signin') {
	require_once(getRoot() . 'views/signin.php');
	if (isset($_POST['login']) && $_POST['login'] !== ""
		&& isset($_POST['password']) && $_POST['password'] !== ""
		&& isset($_POST['submit']) && $_POST['submit'] === 'Sign in') {
		Route::post('AuthController@signin');
	}
} else if ($_SERVER['REQUEST_URI'] === '/signout') {
	Route::post('AuthController@signout');
}
