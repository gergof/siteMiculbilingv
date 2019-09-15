<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PartialResult extends Model {
	protected $fillable = ['result'];
	protected $hidden = ['student', 'objective'];

	public function student() {
		return $this->belongsTo('App\Student');
	}

	public function objective() {
		return $this->belongsTo('App\Objective');
	}
}
