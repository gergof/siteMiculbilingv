<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model {
	public function season() {
		return $this->belongsTo('App\Season');
	}

	public function school() {
		return $this->belongsTo('App\School');
	}

	public function document() {
		return $this->belongsTo('App\Document');
	}
}
