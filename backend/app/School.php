<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class School extends Model {
	protected $fillable = ['name_ro', 'name_hu', 'county', 'city'];
	protected $hidden = ['users', 'contracts'];

	public function users() {
		return $this->hasMany('App\User');
	}

	public function contracts() {
		return $this->hasMany('App\Contract');
	}
}
