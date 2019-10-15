<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model {
	protected $fillable = ['name', 'class'];
	protected $hidden = ['season', 'partialResults', 'results', 'school', 'user'];

	public function season() {
		return $this->belongsTo('App\Season');
	}

	public function partialResults() {
		return $this->hasMany('App\PartialResult');
	}

	public function results() {
		return $this->hasMany('App\Result');
	}

	public function school() {
		return $this->belongsTo('App\School');
	}

	public function user() {
		return $this->belongsTo('App\User');
	}
}
