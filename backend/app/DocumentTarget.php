<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DocumentTarget extends Model {
	protected $fillable = ['user_id'];
	protected $hidden = ['document', 'user'];

	public function document() {
		return $this->belongsTo('App\Document');
	}

	public function user() {
		return $this->belongsTo('App\User');
	}
}
