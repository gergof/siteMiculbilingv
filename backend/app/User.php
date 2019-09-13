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
		'password', 'email_verification_token',
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
		return $this->hasMany('App\Announcement');
	}

	public function announcementTargets() {
		return $this->hasMany('App\AnnouncementTarget');
	}

	public function messages() {
		return $this->hasMany('App\Message');
	}

	public function incomingMessages() {
		return $this->hasMany('App\Message', 'recipient_id');
	}

	public function documentTargets() {
		return $this->hasMany('App\DocumentTarget');
	}
}
