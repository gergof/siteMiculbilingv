<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model {
	protected $fillable = ['message', 'is_read'];
	protected $hidden = ['user', 'recipient'];

	public function user() {
		return $this->belongsTo('App\User');
	}

	public function recipient() {
		return $this->belongsTo('App\User', 'recipient_id');
	}
}