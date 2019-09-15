<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Objective extends Model {
	protected $fillable = ['name', 'description', 'class', 'max_points'];
	protected $hidden = ['phase', 'partialResults'];

	public function phase() {
		return $this->belongsTo('App\Phase');
	}

	public function partialResults() {
		return $this->hasMany('App\PartialResult');
	}
}
