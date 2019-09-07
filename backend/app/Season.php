<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Season extends Model {
	protected $fillable = ['name'];

	public function contracts() {
		return $this->hasMany('App\Contract');
	}

	public function documents() {
		return $this->hasMany('App\Document');
	}
}
