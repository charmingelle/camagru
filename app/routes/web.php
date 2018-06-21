<?php

require_once(getRoot() . 'app/controllers/AuthController.php');
require_once(getRoot() . 'app/controllers/DataController.php');
require_once(getRoot() . 'app/controllers/SiteMapController.php');
require_once(getRoot() . 'app/core/Route.class.php');
require_once(getRoot() . 'app/core/Message.php');

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

Route::get('/changePassword', 'AuthController@showChangePassword');
Route::post('/changePassword', 'AuthController@changePassword');

Route::get('/forgotPassword', 'SiteMapController@showForgotPassword');
Route::post('/forgotPassword', 'AuthController@sendResetLink');

Route::post('/photos', 'DataController@getPhotos');

Route::get('/account', 'SiteMapController@showAccount');

Route::post('/stickers', 'DataController@getStickers');

Route::post('/save-picture', 'DataController@savePicture');

Route::post('/userPictures', 'DataController@getUserPictures');

// Route::post('/userPictures', 'DataController@getUserPictures')->if(User,authentificated);
