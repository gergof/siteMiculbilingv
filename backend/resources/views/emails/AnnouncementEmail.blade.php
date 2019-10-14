@extends('emails.Base')

@section('title', 'Új hír: ' . $title)

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
	<p>Kedves {{ $user_name }}!</p>
	<p>
		A weboldalon egy új hír olvasható!
	</p>
	<div class="message">
		{!! $content !!}
	</div>
@endsection

@section('actions')
	<div class="button__width button__margin">
		<a href="{{ $announcementUrl }}">
			<div class="button">
				<span>Hír megtekintése</span>
			</div>
		</a>
	</div>
@endsection

@section('footer')
	<p>
		Ammennyiben a fenti gomb nem működik, kérlek másold be az alábbi linket a böngésződ címsorába:
		<br/>
		<a href="{{ $announcementUrl }}">{{ $announcementUrl }}</a>
	</p>
	<a href="{{ $unsubscribeUrl }}">
		Leiratkozás
	</a>
@endsection
