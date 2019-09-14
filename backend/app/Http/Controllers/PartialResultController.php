<?php

namespace App\Http\Controllers;

use App\Objective;
use App\PartialResult;
use App\Phase;
use App\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class PartialResultController extends Controller {
	public function index(Request $request) {
		$filters = $request->validate([
			'phase_id' => 'integer|required|exists:phases,id',
		]);

		$phase = Phase::find($filters['phase_id']);

		//acl
		if ($phase->deadline->greaterThan(Carbon::now())) {
			if (is_null(Auth::user())) {
				return response()->json(['error' => 'Forbiden. Deadline has not passed yet'], 403);
			}
			if (Auth::user()->role == 'lmanager') {
				$partialResults = PartialResult::with('objective', 'student.school')
					->whereHas('objective', function ($query) use ($filters) {
						$query->where('phase_id', $filters['phase_id']);
					})
					->whereHas('student.school', function ($query) {
						$query->where('county', Auth::user()->school->county);
					})
					->get();
				return response()->json($partialResults);
			}
			if (Auth::user()->role != 'manager' && Auth::user()->role != 'admin') {
				return response()->json(['error' => 'Forbiden. Deadline has not passed yet'], 403);
			}
		}

		$partialResults = $phase->objectives()->with('partialResults')->get()->pluck('partialResults')->collapse();
		return response()->json($partialResults);
	}

	public function store(Request $request) {
		$data = $request->validate([
			'student_id' => 'integer|required|exists:students,id',
			'objective_id' => 'integer|required|exists:objectives,id',
			'result' => 'integer|required|gt:0',
		]);

		$student = Student::find($data['student_id']);
		$objective = Objective::find($data['objective_id']);

		//acl
		if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager' && Auth::user()->role != 'lmanager') {
			return response()->json(['error' => 'Forbiden'], 403);
		}
		if (Auth::user()->role == 'lmanager') {
			if ($objective->phase->deadline->lessThan(Carbon::now())) {
				return response()->json(['error' => 'Deadline already passed'], 400);
			}
			if ($student->school->county != Auth::user()->school->county) {
				return response()->json(['error' => 'Forbiden'], 403);
			}
		}

		if (!$objective->phase->is_rated) {
			return response()->json(['error' => 'Phase not rated'], 400);
		}

		$existing = PartialResult::where('student_id', $data['student_id'])->where('objective_id', $data['objective_id'])->first();
		if (!is_null($existing)) {
			return response()->json(['error' => 'Partial result already exists'], 400);
		}

		if ($data['result'] > $objective->max_points) {
			return response()->json(['error' => 'Result too big'], 400);
		}

		$partialResult = new PartialResult();
		$partialResult->student()->associate($student);
		$partialResult->objective()->associate($objective);
		$partialResult->result = $data['result'];
		$partialResult->save();

		return response()->json($partialResult, 201);
	}

	public function show($id) {
		$partialResult = PartialResult::find($id);
		if (is_null($partialResult)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if ($partialResult->objective->phase->deadline->greaterThan(Carbon::now())) {
			if (is_null(Auth::user())) {
				return response()->json(['error' => 'Forbiden. Deadline has not passed yet'], 403);
			}
			if (Auth::user()->role == 'lmanager') {
				if ($partialResult->student->school->county != Auth::user()->school->county) {
					return response()->json(['error' => 'Forbiden. Deadline has not passed yet'], 403);
				}
				return response()->json($partialResult);
			}
			if (Auth::user()->role != 'manager' && Auth::user()->role != 'admin') {
				return response()->json(['error' => 'Forbiden. Deadline has not passed yet'], 403);
			}
		}

		return response()->json($partialResult);
	}

	public function update(Request $request, $id) {
		$data = $request->validate([
			'result' => 'integer|gt:0',
		]);

		$partialResult = PartialResult::find($id);
		if (is_null($partialResult)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager' && Auth::user()->role != 'lmanager') {
			return response()->json(['error' => 'Forbiden'], 403);
		}
		if (Auth::user()->role == 'lmanager') {
			if ($partialResult->objective->phase->deadline->lessThan(Carbon::now())) {
				return response()->json(['error' => 'Deadline already passed'], 400);
			}
			if ($partialResult->student->school->county != Auth::user()->school->county) {
				return response()->json(['error' => 'Forbiden'], 403);
			}
		}

		if (!empty($data['result'])) {
			if ($data['result'] > $partialResult->objective->max_points) {
				return response()->json(['error' => 'Result too big'], 400);
			}
			$partialResult->result = $data['result'];
		}

		$partialResult->save();

		return response()->json($partialResult);
	}

	public function destroy($id) {
		$partialResult = PartialResult::find($id);
		if (is_null($partialResult)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager' && Auth::user()->role != 'lmanager') {
			return response()->json(['error' => 'Forbiden'], 403);
		}
		if (Auth::user()->role == 'lmanager') {
			if ($partialResult->objective->phase->deadline->lessThan(Carbon::now())) {
				return response()->json(['error' => 'Deadline already passed'], 400);
			}
			if ($partialResult->student->school->county != Auth::user()->school->county) {
				return response()->json(['error' => 'Forbiden'], 403);
			}
		}

		$partialResult->delete();

		return response()->json(['message' => 'Deleted']);
	}
}
