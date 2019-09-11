<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Season extends Model {
	protected $fillable = ['name'];
	protected $hidden = ['contracts', 'documents'];

	public function contracts() {
		return $this->hasMany('App\Contract');
	}

	public function documents() {
		return $this->hasMany('App\Document');
	}
}
