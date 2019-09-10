@extends('emails.Base')

@section('title', 'Új üzenet tőle: ' . $sender_name)

@section('head')
	@parent
	<style>
		.message {
			background: #F0F0F0;
			border-radius: 2px;
			margin-left: 2em;
			padding: 1em;
		}
	</style>
@endsection

@section('content')
	<p>Kedves {{ $recipient_name }}!</p>
	<p>
		A weboldalon új üzeneted érkezett tőle: {{ $sender_name }}
	</p>
	<div class="message">
		{!! $content !!}
	</div>
@endsection

@section('actions')
	<div class="button__width button__margin">
		<a href="{{ $messageUrl }}">
			<div class="button">
				<span>Üzenet megtekintése,<br/>válasz írása</span>
			</div>
		</a>
	</div>
@endsection

@section('footer')
	<p>
		Ammennyiben a fenti gomb nem működik, kérlek másold be az alábbi linket a böngésződ címsorába:
		<br/>
		<a href="{{ $messageUrl }}">{{ $messageUrl }}</a>
	</p>
	<a href="{{ $unsubscribeUrl }}">
		Leiratkozás
	</a>
@endsection
