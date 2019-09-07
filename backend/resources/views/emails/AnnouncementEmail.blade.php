@extends('emails.Base')

@section('title', 'Új közlemény: ' . $title)

@section('head')
	@parent
	<style>
		.message__container {
			padding-left: 2em;
			display: flex;
			flex-direction: row;
		}
		.message__icon {
			margin-right: 0.5em;
		}
		.message {
			background: #F0F0F0;
			border-radius: 2px;
			padding: 1em;
			flex: 1;
		}
	</style>
@endsection

@section('content')
	<p>Kedves {{ $user_name }}!</p>
	<p>
		A weboldalon egy új közleményt tettek közzé!
	</p>
	<div class="message__container">
		<div class="message__icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 18 18"><path d="M10 5v5h2.75L11 13h2.25L15 10V5h-5zm-7 5h2.75L4 13h2.25L8 10V5H3v5z"/></svg>
		</div>
		<div class="message">
			{!! $content !!}
		</div>
	</div>
@endsection

@section('actions')
	<div class="button__width button__margin">
		<a href="{{ $announcementUrl }}">
			<div class="button">
				<span>Közlemény megtekintése</span>
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
