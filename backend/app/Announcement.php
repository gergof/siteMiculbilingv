<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model {
	protected $fillable = ['title', 'message', 'is_public'];

	public function user() {
		return $this->belongsTo('App\User');
	}

	public function targets() {
		return $this->hasMany('App\AnnouncementTarget');
	}
}
