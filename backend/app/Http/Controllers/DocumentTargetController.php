<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class DocumentTargetController extends Controller {
	public function index() {
		return response()->json(Auth::user()->documentTargets);
	}
}
