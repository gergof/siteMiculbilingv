<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Phase extends Model {
	protected $fillable = ['name', 'is_registration', 'is_advance', 'is_local_managed', 'is_rated'];
	protected $hidden = ['phase', 'objectives', 'results'];

	public function season() {
		return $this->belongsTo('App\Season');
	}

	public function objectives() {
		return $this->hasMany('App\Objective');
	}

	public function results() {
		return $this->hasMany('App\Result');
	}
}
