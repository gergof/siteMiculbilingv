<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PasswordResetToken extends Model {
	protected $fillable = ['token'];

	public function user() {
		return $this->belongsTo('App\User');
	}

	public function getResetUrl() {
		return config('app.url') . '/auth/passwordReset?token=' . $this->token;
	}

	public function getInvalidateUrl() {
		return $this->getResetUrl() . '&invalidate=true';
	}
}
