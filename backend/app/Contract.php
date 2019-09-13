<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model {
	protected $hidden = ['season', 'school', 'document'];

	public function season() {
		return $this->belongsTo('App\Season');
	}

	public function school() {
		return $this->belongsTo('App\School');
	}

	public function document() {
		return $this->belongsTo('App\Document');
	}

	public static function boot() {
		parent::boot();

		static::deleted(function ($contract) {
			$contract->document->delete();
		});
	}
}
