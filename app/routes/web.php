<?php

// if ($uri == '/')
// {
// 	require_once(getRoot() . 'views/home.php');
// 	exit();
// }



Route::get('/', 'siteMapController@home');
// Route::post('/register', 'authController@signup');
Route::post('/register', 'authController@createAccount');
// Route::endroute();

// if ($_SERVER["REQUEST_URI"] == "/register") {
// 	require_once(getRoot() . 'modules/create_account.php');
// }
