<?php

namespace App\Http\Controllers;

use App\Jobs\CalculateResults;
use App\Phase;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class ContestController extends Controller {
	public function calculateResults(Request $request) {
		$data = $request->validate([
			'phase_id' => 'integer|required|exists:phases,id',
		]);

		$phase = Phase::find($data['phase_id']);

		//acl
		if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager' && Auth::user()->role != 'lmanager') {
			return response()->json(['error' => 'Forbidden'], 403);
		}
		if (Auth::user()->role == 'lmanager' && $phase->deadline->lessThan(Carbon::now())) {
			return response()->json(['error' => 'Deadline have passed'], 400);
		}

		CalculateResults::dispatch([
			'phase_id' => $data['phase_id'],
			'county_filter' => Auth::user()->role == 'lmanager' ? [Auth::user()->school->county] : null,
		]);

		return response()->json(['message' => 'Job scheduled for execution']);
	}
}
