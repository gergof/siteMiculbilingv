<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AnnouncementTarget extends Model {
	protected $fillable = ['is_read', 'user_id'];
	protected $hidden = ['user', 'announcement'];

	public function user() {
		return $this->belongsTo('App\User');
	}

	public function announcement() {
		return $this->belongsTo('App\Announcement');
	}
}
