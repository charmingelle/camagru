<?php

require_once(getRoot() . 'app/controllers/AuthController.php');
require_once(getRoot() . 'app/controllers/DataController.php');
require_once(getRoot() . 'app/controllers/SiteMapController.php');
require_once(getRoot() . 'app/core/Route.class.php');
require_once(getRoot() . 'app/core/Message.php');

// Route::get(['uri' => '/', 'controller' => 'SiteMapController@showHome']);

// Route::get(['uri' => '/signup', 'controller' => 'AuthController@signup']);
// Route::post(['uri' => '/signup', 'controller' => 'AuthController@sendVerification']);

// Route::get(['uri' => '/signin', 'controller' => 'SiteMapController@showSignin', 'condition' => 'not signed in']);
// Route::post(['uri' => '/signin', 'controller' => 'AuthController@signin']);

// Route::get(['uri' => '/signout', 'controller' => 'AuthController@signout', 'condition' => 'signed in']);

// Route::get(['uri' => '/changeEmail', 'controller' => 'SiteMapController@showChangeEmail', 'condition' => 'signed in']);
// Route::post(['uri' => '/changeEmail', 'controller' => 'AuthController@changeEmail']);

// Route::get(['uri' => '/changeLogin', 'controller' => 'SiteMapController@showChangeLogin', 'condition' => 'signed in']);
// Route::post(['uri' => '/changeLogin', 'controller' => 'AuthController@changeLogin']);

// Route::get(['uri' => '/changePassword', 'controller' => 'AuthController@showChangePassword']);
// Route::post(['uri' => '/changePassword', 'controller' => 'AuthController@changePassword']);

// Route::get(['uri' => '/forgotPassword', 'controller' => 'SiteMapController@showForgotPassword', 'condition' => 'not signed in']);
// Route::post(['uri' => '/forgotPassword', 'controller' => 'AuthController@sendResetLink']);

// Route::post(['uri' => '/photos', 'controller' => 'DataController@getPhotos']);

// Route::get(['uri' => '/account', 'controller' => 'SiteMapController@showAccount', 'condition' => 'signed in']);

// Route::post(['uri' => '/stickers', 'controller' => 'DataController@getStickers']);

// Route::post(['uri' => '/save-picture', 'controller' => 'DataController@savePicture']);

// Route::post(['uri' => '/userPictures', 'controller' => 'DataController@getUserPictures', 'condition' => 'signed in']);

// Route::post(['uri' => '/deleteUserPicture', 'controller' => 'DataController@deleteUserPicture', 'condition' => 'signed in']);

// Route::post(['url' => '/like', 'controller' => 'DataController@likePicture', 'condition' => 'signed in']);





Route::get('/', 'SiteMapController@showHome');

Route::get('/js/home.js', 'SiteMapController@showJS');

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

Route::post('/savePicture', 'DataController@savePicture');

Route::post('/userPictures', 'DataController@getUserPictures');

Route::post('/deleteUserPicture', 'DataController@deleteUserPicture');

Route::post('/like', 'DataController@likePicture');

Route::post('/getLikes', 'DataController@getLikes');

Route::post('/addComment', 'DataController@addComment');

Route::post('/increaseCommentCount', 'DataController@increaseCommentCount');

Route::post('/getComments', 'DataController@getComments');

Route::post('/isSignedIn', 'AuthController@isSignedIn');
