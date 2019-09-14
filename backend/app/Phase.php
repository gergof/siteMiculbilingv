<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Phase extends Model {
	protected $fillable = ['name', 'is_registration', 'is_advance', 'is_local_managed', 'is_rated'];
	protected $hidden = ['season', 'objectives', 'results'];
	protected $dates = ['deadline'];
	protected $casts = ['deadline' => 'datetime:c'];

	public function season() {
		return $this->belongsTo('App\Season');
	}

	public function objectives() {
		return $this->hasMany('App\Objective');
	}

	public function results() {
		return $this->hasMany('App\Result');
	}

	public function setDeadlineAttribute($value) {
		$this->attributes['deadline'] = Carbon::parse($value)->setTimezone('UTC');
	}
}
