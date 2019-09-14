<?php

namespace App\Http\Controllers;

use App\Objective;
use App\Phase;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class ObjectiveController extends Controller {
	public function index(Request $request) {
		$filters = $request->validate([
			'phase_id' => 'integer|required|exists:phases,id',
		]);

		//acl
		if (is_null(Auth::user()) || (Auth::user()->role != 'manager' && Auth::user()->role != 'admin')) {
			$phase = Phase::find($filters['phase_id']);
			if ($phase->deadline->greaterThan(Carbon::now())) {
				return response()->json(['error' => 'Forbidden. Deadline has not passed yet'], 403);
			}
		}

		return response()->json(Objective::where('phase_id', $filters['phase_id'])->get());
	}

	public function store(Request $request) {
		$data = $request->validate([
			'phase_id' => 'integer|required|exists:phases,id',
			'class' => 'integer|required|gte:3|lte:4',
			'name' => 'string|required',
			'description' => 'string|required',
			'max_points' => 'integer|required|gt:0',
		]);

		//acl
		if (Auth::user()->role != 'manager' && Auth::user()->role != 'admin') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$phase = Phase::find($data['phase_id']);

		$objective = new Objective();
		$objective->phase()->associate($phase);
		$objective->class = $data['class'];
		$objective->name = $data['name'];
		$objective->description = $data['description'];
		$objective->max_points = $data['max_points'];
		$objective->save();

		return response()->json($objective, 201);
	}

	public function show($id) {
		$objective = Objective::find($id);
		if (is_null($objective)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (
			$objective->phase->deadline->greaterThan(Carbon::now()) &&
			(
				is_null(Auth::user()) ||
				(
					Auth::user()->role != 'admin' &&
					Auth::user()->role != 'manager'
				)
			)
		) {
			return response()->json(['error' => 'Forbidden. Deadline has not passed yet'], 403);
		}

		return response()->json($objective);
	}

	public function update(Request $request, $id) {
		$data = $request->validate([
			'name' => 'string',
			'description' => 'string',
			'max_points' => 'integer|gt:0',
		]);

		$objective = Objective::find($id);
		if (is_null($objective)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		if (!empty($data['name'])) {
			$objective->name = $data['name'];
		}
		if (!empty($data['description'])) {
			$objective->description = $data['description'];
		}
		if (!empty($data['max_points'])) {
			$objective->max_points = $data['max_points'];
		}

		$objective->save();

		return response()->json($objective);
	}

	public function destroy($id) {
		$objective = Objective::find($id);
		if (is_null($objective)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (Auth::user()->role != 'manager' && Auth::user()->role != 'admin') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$objective->delete();

		return response()->json(['message' => 'Deleted']);
	}
}
