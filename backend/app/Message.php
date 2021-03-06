<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model {
	protected $fillable = ['message', 'is_read'];

	public function user() {
		return $this->belongsTo('App\User')->select(['id', 'name']);
	}

	public function recipient() {
		return $this->belongsTo('App\User', 'recipient_id')->select(['id', 'name']);
	}
}
