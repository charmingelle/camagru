<?php

require_once(getRoot() . 'app/controllers/AuthController.php');
require_once(getRoot() . 'app/controllers/DataController.php');
require_once(getRoot() . 'app/controllers/SiteMapController.php');
require_once(getRoot() . 'app/core/Route.php');
require_once(getRoot() . 'app/core/Message.php');

Route::get(['uri' => '/', 'controller' => 'SiteMapController@showHome']);

Route::get(['uri' => '/signup', 'controller' => 'AuthController@signup']);
Route::post(['uri' => '/signup', 'controller' => 'AuthController@sendVerification']);

Route::post(['uri' => '/signin', 'controller' => 'AuthController@signin']);

Route::get(['uri' => '/signout', 'controller' => 'AuthController@signout']);

Route::post(['uri' => '/changeEmail', 'controller' => 'AuthController@changeEmail', 'condition' => 'signed in']);

Route::post(['uri' => '/changeLogin', 'controller' => 'AuthController@changeLogin', 'condition' => 'signed in']);

Route::get(['uri' => '/changePassword', 'controller' => 'AuthController@tempAccountAccess']);
Route::post(['uri' => '/changePassword', 'controller' => 'AuthController@changePassword', 'condition' => 'signed in']);

Route::post(['uri' => '/forgotPassword', 'controller' => 'AuthController@sendForgotPasswordEmail']);

Route::post(['uri' => '/resetPassword', 'controller' => 'AuthController@resetPassword', 'condition' => 'emailed']);

Route::post(['uri' => '/photos', 'controller' => 'DataController@getPhotos']);

Route::post(['uri' => '/isSignedIn', 'controller' => 'AuthController@isSignedIn']);

Route::post(['uri' => '/like', 'controller' => 'DataController@likePicture', 'condition' => 'signed in']);

Route::post(['uri' => '/getLikes', 'controller' => 'DataController@getLikes']);

Route::post(['uri' => '/addComment', 'controller' => 'DataController@addComment', 'condition' => 'signed in']);

Route::post(['uri' => '/increaseCommentCount', 'controller' => 'DataController@increaseCommentCount', 'condition' => 'signed in']);

Route::post(['uri' => '/getComments', 'controller' => 'DataController@getComments']);

Route::post(['uri' => '/getLastPublicPhotoId', 'controller' => 'DataController@getLastPublicPhotoId']);

Route::get(['uri' => '/account', 'controller' => 'SiteMapController@showAccount', 'condition' => 'signed in']);

Route::post(['uri' => '/getLogin', 'controller' => 'DataController@getLogin', 'condition' => 'signed in']);

Route::post(['uri' => '/stickers', 'controller' => 'DataController@getStickers', 'condition' => 'signed in']);

Route::post(['uri' => '/savePhoto', 'controller' => 'DataController@savePhoto', 'condition' => 'signed in']);

Route::post(['uri' => '/userPictures', 'controller' => 'DataController@getUserPictures', 'condition' => 'signed in']);

Route::post(['uri' => '/deleteUserPicture', 'controller' => 'DataController@deleteUserPicture', 'condition' => 'signed in']);

Route::post(['uri' => '/getPhotoPrivate', 'controller' => 'DataController@getPhotoPrivate', 'condition' => 'signed in']);

Route::post(['uri' => '/publish', 'controller' => 'DataController@publish', 'condition' => 'signed in']);

Route::post(['uri' => '/getNotification', 'controller' => 'DataController@getNotification', 'condition' => 'signed in']);

Route::post(['uri' => '/changeNotification', 'controller' => 'DataController@changeNotification', 'condition' => 'signed in']);

// Route::get(['uri' => '/smth', 'controller' => 'SiteMapController@show404']);
