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
	Route::resource('schools', 'SchoolController')->only(['index', 'store', 'show', 'update', 'destroy']);
	Route::resource('contracts', 'ContractController')->only(['index', 'store', 'show', 'destroy']);
	Route::resource('documents', 'DocumentController')->only(['index', 'store', 'show', 'update', 'destroy']);
	Route::resource('documentTargets', 'DocumentTargetController')->only(['index']);
	Route::resource('phases', 'PhaseController')->only(['index', 'store', 'show', 'update', 'destroy']);
	Route::resource('students', 'StudentController')->only(['index', 'store', 'show', 'update']);
	Route::resource('objectives', 'ObjectiveController')->only(['index', 'store', 'show', 'update', 'destroy']);
	Route::resource('partialResults', 'PartialResultController')->only(['index', 'store', 'show', 'update', 'destroy']);
	Route::resource('results', 'ResultController')->only(['index', 'store', 'show', 'update']);
});

Route::post('auth/login', 'LoginController@login');

Route::post('auth/register', 'RegisterController@register');
Route::post('auth/verifyEmail', 'RegisterController@verifyEmail');

Route::post('auth/passwordReset', 'PasswordResetController@passwordReset');
Route::post('auth/passwordReset/reset', 'PasswordResetController@reset');
Route::post('auth/passwordReset/invalidate', 'PasswordResetController@invalidate');

Route::group(['prefix' => 'public'], function () {
	Route::resource('announcements', 'AnnouncementController')->only(['index', 'show']);
	Route::resource('seasons', 'SeasonController')->only(['index', 'show']);
	Route::resource('schools', 'SchoolController')->only(['index', 'show']);
	Route::resource('documents', 'DocumentController')->only(['index', 'show']);
	Route::resource('phases', 'PhaseController')->only(['index', 'show']);
	Route::resource('students', 'StudentController')->only(['index', 'show']);
	Route::resource('objectives', 'ObjectiveController')->only(['index', 'show']);
	Route::resource('partialResults', 'PartialResultController')->only(['index', 'show']);
	Route::resource('results', 'ResultController')->only(['index', 'show']);
});
