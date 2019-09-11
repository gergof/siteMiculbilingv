<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::group(['middleware' => 'auth:token'], function () {
	Route::post('auth/logout', 'LoginController@logout');

	Route::get('me', 'ProfileController@index');
	Route::put('me', 'ProfileController@update');

	Route::resource('announcements', 'AnnouncementController')->only(['index', 'store', 'show', 'update', 'destroy']);
	Route::resource('announcementTargets', 'AnnouncementTargetController')->only(['index', 'update']);
	Route::resource('messages', 'MessageController')->only(['index', 'store', 'show', 'update', 'destroy']);
	Route::resource('seasons', 'SeasonController')->only(['index', 'store', 'show', 'update']);
});

Route::post('auth/login', 'LoginController@login');

Route::post('auth/register', 'RegisterController@register');
Route::post('auth/verifyEmail', 'RegisterController@verifyEmail');

Route::post('auth/passwordReset', 'PasswordResetController@passwordReset');
Route::post('auth/passwordReset/reset', 'PasswordResetController@reset');
Route::post('auth/passwordReset/invalidate', 'PasswordResetController@invalidate');

Route::get('publicAnnouncements', 'AnnouncementController@indexPublic');

Route::resource('seasons', 'SeasonController')->only(['index', 'show']);
