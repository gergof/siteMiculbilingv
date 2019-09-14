<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model {
	protected $fillable = ['name', 'class'];
	protected $hidden = ['season', 'partialResults', 'results'];

	public function season() {
		return $this->belongsTo('App\Season');
	}

	public function partialResults() {
		return $this->hasMany('App\PartialResult');
	}

	public function results() {
		return $this->hasMany('App\Result');
	}
}
