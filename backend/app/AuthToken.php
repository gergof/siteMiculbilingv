<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AuthToken extends Model {
	protected $fillable = ['access_token', 'expires_at'];

	public function user() {
		return $this->belongsTo('App\User');
	}
}
