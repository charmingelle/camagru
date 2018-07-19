<?php

require_once(getRoot() . 'app/controllers/AuthController.php');
require_once(getRoot() . 'app/controllers/DataController.php');
require_once(getRoot() . 'app/controllers/SiteMapController.php');
require_once(getRoot() . 'app/core/Route.php');
require_once(getRoot() . 'app/core/Message.php');

// Route::get(['uri' => '/', 'controller' => 'SiteMapController@showHome']);

// Route::get(['uri' => '/signup', 'controller' => 'AuthController@signup']);
// Route::post(['uri' => '/signup', 'controller' => 'AuthController@sendVerification']);

// Route::get(['uri' => '/signin', 'controller' => 'SiteMapController@showSignin', 'condition' => 'not signed in']);
// Route::post(['uri' => '/signin', 'controller' => 'AuthController@signin']);

// Route::get(['uri' => '/signout', 'controller' => 'AuthController@signout', 'condition' => 'signed in']);

// Route::get(['uri' => '/changeEmail', 'controller' => 'SiteMapController@showChangeEmail', 'condition' => 'signed in']);
// Route::post(['uri' => '/changeEmail', 'controller' => 'AuthController@changeEmail', 'condition' => 'signed in']);

// Route::get(['uri' => '/changeLogin', 'controller' => 'SiteMapController@showChangeLogin', 'condition' => 'signed in']);
// Route::post(['uri' => '/changeLogin', 'controller' => 'AuthController@changeLogin', 'condition' => 'signed in']);

// Route::get(['uri' => '/changePassword', 'controller' => 'AuthController@showChangePassword']);
// Route::post(['uri' => '/changePassword', 'controller' => 'AuthController@changePassword', 'condition' => 'signed in']);

// Route::get(['uri' => '/forgotPassword', 'controller' => 'SiteMapController@showForgotPassword', 'condition' => 'not signed in']);
// Route::post(['uri' => '/forgotPassword', 'controller' => 'AuthController@sendForgotPasswordEmail']);

// in case $_SESSION['auth-data']['email'] is set !!!!!!!!!
// Route::post(['uri' => 'resetPassword', 'controller' => 'AuthController@resetPassword', 'condition' => 'emailed']);

// Route::post(['uri' => '/photos', 'controller' => 'DataController@getPhotos']);

// Route::get(['uri' => '/account', 'controller' => 'SiteMapController@showAccount', 'condition' => 'signed in']);

// Route::post(['uri' => '/stickers', 'controller' => 'DataController@getStickers']);

// Route::post(['uri' => '/save-picture', 'controller' => 'DataController@savePicture']);

// Route::post(['uri' => '/userPictures', 'controller' => 'DataController@getUserPictures', 'condition' => 'signed in']);

// Route::post(['uri' => '/deleteUserPicture', 'controller' => 'DataController@deleteUserPicture', 'condition' => 'signed in']);

// Route::post(['url' => '/like', 'controller' => 'DataController@likePicture', 'condition' => 'signed in']);



// Route::get('/', 'SiteMapController@showHome');

// Route::get('/signup', 'AuthController@signup');
// Route::post('/signup', 'AuthController@sendVerification');

// Route::post('/signin', 'AuthController@signin');

// Route::get('/signout', 'AuthController@signout');

// Route::post('/changeEmail', 'AuthController@changeEmail');

// Route::post('/changeLogin', 'AuthController@changeLogin');

// Route::get('/changePassword', 'AuthController@tempAccountAccess');
// Route::post('/changePassword', 'AuthController@changePassword');

// Route::post('/forgotPassword', 'AuthController@sendForgotPasswordEmail');

// Route::post('/resetPassword', 'AuthController@resetPassword');

// Route::post('/photos', 'DataController@getPhotos');

// Route::get('/account', 'SiteMapController@showAccount');

// Route::post('/getLogin', 'DataController@getLogin');

// Route::post('/stickers', 'DataController@getStickers');

// Route::post('/savePicture', 'DataController@savePicture');

// Route::post('/userPictures', 'DataController@getUserPictures');

// Route::post('/deleteUserPicture', 'DataController@deleteUserPicture');

// Route::post('/getPhotoPrivate', 'DataController@getPhotoPrivate');

// Route::post('/publish', 'DataController@publish');

// Route::post('/like', 'DataController@likePicture');

// Route::post('/getLikes', 'DataController@getLikes');

// Route::post('/addComment', 'DataController@addComment');

// Route::post('/increaseCommentCount', 'DataController@increaseCommentCount');

// Route::post('/getComments', 'DataController@getComments');

// Route::post('/isSignedIn', 'AuthController@isSignedIn');



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

Route::post(['uri' => '/savePicture', 'controller' => 'DataController@savePicture', 'condition' => 'signed in']);

Route::post(['uri' => '/userPictures', 'controller' => 'DataController@getUserPictures', 'condition' => 'signed in']);

Route::post(['uri' => '/deleteUserPicture', 'controller' => 'DataController@deleteUserPicture', 'condition' => 'signed in']);

Route::post(['uri' => '/getPhotoPrivate', 'controller' => 'DataController@getPhotoPrivate', 'condition' => 'signed in']);

Route::post(['uri' => '/publish', 'controller' => 'DataController@publish', 'condition' => 'signed in']);

Route::post(['uri' => '/getNotification', 'controller' => 'DataController@getNotification', 'condition' => 'signed in']);

Route::post(['uri' => '/changeNotification', 'controller' => 'DataController@changeNotification', 'condition' => 'signed in']);
