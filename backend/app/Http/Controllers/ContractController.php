<?php

namespace App\Http\Controllers;

use App\Contract;
use App\Document;
use App\Season;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContractController extends Controller {
	public function index() {
		if (Auth::user()->role == 'admin' || Auth::user()->role == 'manager') {
			return response()->json(Contract::all());
		} else {
			return response()->json(Auth::user()->school->contracts);
		}
	}

	public function store(Request $request) {
		$data = $request->validate([
			'contract' => 'file|required|mimes:pdf|max:5000',
		]);

		$season = Season::latest()->first();

		$document = new Document();
		$document->name = 'contract_' . Auth::user()->school->name_ro . '_' . $season->name . '_user_' . Auth::user()->name . '.pdf';
		$document->season()->associate($season);
		$document->saveFile($request->file('contract'));
		$document->save();

		$contract = new Contract();
		$contract->season()->associate($season);
		$contract->school()->associate(Auth::user()->school);
		$contract->document()->associate($document);
		$contract->save();

		return response()->json($contract, 201);
	}

	public function show($id) {
		$contract = Contract::find($id);
		if (is_null($contract)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (!$contract->school->is(Auth::user()->school) && Auth::user()->role != 'admin' && Auth::user()->role != 'manager') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		return response()->json($contract);
	}

	public function destroy($id) {
		$contract = Contract::find($id);
		if (is_null($contract)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acld
		if (Auth::user()->role != 'admin' && Auth::user()->role != 'manager') {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$contract->delete();
		return response()->json(['message' => 'Deleted']);
	}
}
