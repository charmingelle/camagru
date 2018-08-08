<?php

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

Route::post(['uri' => '/resetPassword', 'controller' => 'AuthController@resetPassword']);

Route::post(['uri' => '/photos', 'controller' => 'DataController@getPhotos']);

Route::post(['uri' => '/isSignedIn', 'controller' => 'AuthController@isSignedIn']);

Route::post(['uri' => '/getLikeStatus', 'controller' => 'DataController@getLikeStatus', 'condition' => 'signed in']);

Route::post(['uri' => '/getLikes', 'controller' => 'DataController@getLikes', 'condition' => 'signed in']);

Route::post(['uri' => '/likeDislike', 'controller' => 'DataController@likeDislike', 'condition' => 'signed in']);

Route::post(['uri' => '/addComment', 'controller' => 'DataController@addComment', 'condition' => 'signed in']);

Route::post(['uri' => '/increaseCommentCount', 'controller' => 'DataController@increaseCommentCount', 'condition' => 'signed in']);

Route::post(['uri' => '/decreaseCommentCount', 'controller' => 'DataController@decreaseCommentCount', 'condition' => 'signed in']);

Route::post(['uri' => '/getComments', 'controller' => 'DataController@getComments']);

Route::post(['uri' => '/getLastPublicPhotoId', 'controller' => 'DataController@getLastPublicPhotoId']);

Route::post(['uri' => '/deleteComment', 'controller' => 'DataController@deleteComment', 'condition' => 'signed in']);

Route::get(['uri' => '/account', 'controller' => 'SiteMapController@showAccount', 'condition' => 'signed in']);

Route::post(['uri' => '/getLogin', 'controller' => 'DataController@getLogin']);

Route::post(['uri' => '/stickers', 'controller' => 'DataController@getStickers', 'condition' => 'signed in']);

Route::post(['uri' => '/savePhoto', 'controller' => 'DataController@savePhoto', 'condition' => 'signed in']);

Route::post(['uri' => '/userPictures', 'controller' => 'DataController@getUserPhoto', 'condition' => 'signed in']);

Route::post(['uri' => '/deleteUserPhoto', 'controller' => 'DataController@deleteUserPhoto', 'condition' => 'signed in']);

Route::post(['uri' => '/getPhotoPrivate', 'controller' => 'DataController@getPhotoPrivate', 'condition' => 'signed in']);

Route::post(['uri' => '/publish', 'controller' => 'DataController@publish', 'condition' => 'signed in']);

Route::post(['uri' => '/getNotificationStatus', 'controller' => 'DataController@getNotificationStatus', 'condition' => 'signed in']);

Route::post(['uri' => '/changeNotificationStatus', 'controller' => 'DataController@changeNotificationStatus', 'condition' => 'signed in']);

Route::notFound();
