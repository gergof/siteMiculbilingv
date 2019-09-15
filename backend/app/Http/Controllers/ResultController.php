<?php

namespace App\Http\Controllers;

use App\Phase;
use App\Result;
use App\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class ResultController extends Controller {
	public function index(Request $request) {
		$filters = $request->validate([
			'phase_id' => 'integer|required|exists:phases,id',
		]);

		$phase = Phase::find($filters['phase_id']);

		//acl
		if ($phase->deadline->greaterThan(Carbon::now())) {
			if (is_null(Auth::user())) {
				return response()->json(['error' => 'Forbidden. Deadline has not passed yet'], 403);
			}
			if (Auth::user()->role != 'lmanager' && Auth::user()->role != 'manager' && Auth::user()->role != 'admin') {
				return response()->json(['erro' => 'Forbidden. Deadline has not passed yet'], 403);
			}
			if (Auth::user()->role == 'lmanager') {
				$results = $phase
					->results()
					->with('student.school')
					->whereHas('student.school', function ($query) use ($filters) {
						$query->where('county', Auth::user()->school->county);
					})
					->get();
				return response()->json($results);
			}
		}

		return response()->json($phase->results()->orderBy('result', 'DESC')->get());
	}

	public function store(Request $request) {
		$data = $request->validate([
			'student_id' => 'integer|required|exists:students,id',
			'phase_id' => 'integer|required|exists:phases,id',
			'is_absent' => 'boolean|required',
		]);

		$student = Student::find($data['student_id']);
		$phase = Phase::find($data['phase_id']);

		//acl
		if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager' && Auth::user()->role != 'lmanager') {
			return response()->json(['error' => 'Forbidden'], 403);
		}
		if (Auth::user()->role == 'lmanager') {
			if ($phase->deadline->lessThan(Carbon::now())) {
				return response()->json(['error' => 'Deadline has already passed'], 400);
			}
			if ($student->school->county != Auth::user()->school->county) {
				return response()->json(['error' => 'Forbidden'], 403);
			}
			if (!$phase->is_local_managed) {
				return response()->json(['error' => 'Forbidden'], 403);
			}
		}

		if (Result::where('student_id', $data['student_id'])->where('phase_id', $data['phase_id'])->exists()) {
			return response()->json(['error' => 'Result already exists'], 400);
		}

		$result = new Result();
		$result->student()->associate($student);
		$result->phase()->associate($phase);
		$result->is_absent = $data['is_absent'];
		$result->save();

		return response()->json($result, 201);
	}

	public function show($id) {
		$result = Result::find($id);
		if (is_null($result)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if ($result->phase->deadline->greaterThan(Carbon::now())) {
			if (is_null(Auth::user())) {
				return response()->json(['error' => 'Forbidden. Deadline has not passed yet'], 403);
			}
			if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager' && Auth::user()->role != 'lmanager') {
				return response()->json(['error' => 'Forbidden. Deadline has not passed yet'], 403);
			}
			if (Auth::user()->role == 'lmanager' && $result->student->school->county != Auth::user()->school->county) {
				return response()->json(['error' => 'Forbidden']);
			}
		}

		return response()->json($result);
	}

	public function update(Request $request, $id) {
		$data = $request->validate([
			'is_absent' => 'boolean',
			'is_advanced' => 'boolean',
		]);

		$result = Result::find($id);
		if (is_null($result)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager' && Auth::user()->role != 'lmanager') {
			return response()->json(['error' => 'Forbidden']);
		}
		if (Auth::user()->role == 'lmanager') {
			if ($result->phase->deadline->lessThan(Carbon::now())) {
				return response()->json(['error' => 'Deadline has already passed'], 400);
			}
			if ($result->student->school->county != Auth::user()->school->county) {
				return response()->json(['error' => 'Forbidden'], 403);
			}
			if (!$result->phase->is_local_managed) {
				return response()->json(['error' => 'Forbidden'], 403);
			}
			if (isset($data['is_advanced'])) {
				return response()->json(['error' => 'Local managers can not set is_advanced field'], 400);
			}
		}

		if (isset($data['is_advanced']) && !$result->phase->is_advance) {
			return response()->json(['error' => 'Not advancing phase'], 400);
		}

		if (isset($data['is_absent'])) {
			$result->is_absent = $data['is_absent'];
		}
		if (isset($data['is_advanced'])) {
			$result->is_advanced = $data['is_advanced'];
		}

		$result->save();

		return response()->json($result);
	}
}
