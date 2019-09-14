<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Result extends Model {
	protected $fillable = ['result', 'is_absent'];
	protected $hidden = ['student', 'phase'];

	public function student() {
		return $this->belongsTo('App\Student');
	}

	public function phase() {
		return $this->belongsTo('App\Phase');
	}
}
