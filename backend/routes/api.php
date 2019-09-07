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
});

Route::post('auth/login', 'LoginController@login');

Route::post('auth/register', 'RegisterController@register');
Route::post('auth/verifyEmail', 'RegisterController@verifyEmail');

Route::post('auth/passwordReset', 'PasswordResetController@passwordReset');
Route::post('auth/passwordReset/reset', 'PasswordResetController@reset');
Route::post('auth/passwordReset/invalidate', 'PasswordResetController@invalidate');
