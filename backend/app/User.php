<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable {
	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'name', 'email', 'email_verification_token', 'password', 'class_size', 'class', 'role',
	];

	/**
	 * The attributes that should be hidden for arrays.
	 *
	 * @var array
	 */
	protected $hidden = [
		'password',
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'email_verified_at' => 'datetime',
	];

	public function authTokens() {
		return $this->hasMany('App\AuthToken');
	}

	public function school() {
		return $this->belongsTo('App\School');
	}

	public function announcements() {
		return $this->hasMany('App\AnnouncementTarget');
	}
}
