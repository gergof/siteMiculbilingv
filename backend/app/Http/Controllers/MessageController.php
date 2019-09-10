<?php

namespace App\Http\Controllers;

use App\Mail\MessageEmail;
use App\Message;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class MessageController extends Controller {
	public function index() {
		$announcements = Auth::user()->incomingMessages()->latest()->get();

		return response()->json($announcements);
	}

	public function store(Request $request) {
		$data = $request->validate([
			'recipient_id' => 'integer|required|exists:users,id',
			'message' => 'string|required',
		]);

		$recipient = User::find($data['recipient_id']);

		//acl
		switch (Auth::user()->role) {
		case 'teacher':
			if ($recipient->role != 'lmanager' && $recipient->role != 'manager' && $recipient->role != 'admin') {
				return response()->json(['error' => 'Teachers can only send messages to local managers, managers and admins'], 400);
			}
		case 'lmanager':
			if ($recipient->role == 'teacher' && $recipient->school->county !== Auth::user()->school->county) {
				return response()->json(['error' => 'Local managers can only send messages to teachers in the same county'], 400);
			}
		}

		$message = new Message();
		$message->message = $data['message'];
		$message->user()->associate(Auth::user());
		$message->recipient()->associate($recipient);
		$message->save();

		//send email notification
		if ($recipient->is_email_subscribed) {
			Mail::to($recipient->email)->send(
				new MessageEmail([
					'sender_name' => Auth::user()->name,
					'recipient_name' => $recipient->name,
					'content' => $data['message'],
					'messageUrl' => config('app.url') . '/messages/' . Auth::user()->id . '?highlight=' . $message->id,
					'unsubscribeUrl' => config('app.url') . '/profile/emailUnsubscribe',
				])
			);
		}

		return response()->json(['message' => 'Message created'], 201);
	}

	public function show($id) {
		$message = Message::find($id);
		if (is_null($message)) {
			return response()->json(['error' => 'Not found'], 404);
		} else {
			//acl
			if (!$message->user->is(Auth::user()) && !$message->recipient->is(Auth::user())) {
				return response()->json(['error' => 'Forbidden'], 403);
			}

			return response()->json($message);
		}
	}

	public function update(Request $request, $id) {
		$data = $request->validate([
			'message' => 'string',
		]);

		$message = Message::find($id);
		if (is_null($message)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (!$message->user->is(Auth::user())) {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		if (!empty($data['message'])) {
			$message->message = $data['message'];
		}

		$message->save();

		return response()->json($message);
	}

	public function destroy($id) {
		$message = Message::find($id);
		if (is_null($message)) {
			return response()->json(['error' => 'Not found'], 404);
		}

		//acl
		if (!$message->user->is(Auth::user())) {
			return response()->json(['error' => 'Forbidden'], 403);
		}

		$message->delete();

		return response()->json(['message' => 'Deleted']);
	}
}
