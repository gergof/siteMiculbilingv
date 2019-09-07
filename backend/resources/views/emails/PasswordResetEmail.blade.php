@extends('emails.Base')

@section('title', 'Jelszó visszaállítása')

@section('content')
	<p>Kedves {{ $name }}!</p>
	<p>
		A weboldalunkon megkísérelték visszaállítani a jelszavadat. Amennyiben te voltál az, kérlek kattints a jelszó visszaállítása gombra. Amennyiben nem te voltál, kérlek kattints a nem én voltam gombra.
	</p>
	<p>
		Ez a gomb csak egy óráig működik.
	</p>
@endsection

@section('actions')
	<div class="actionsHolder">
		<div class="button__width button__margin">
			<a href="{{ $resetUrl }}">
				<div class="button">
					<span>Jelszó visszaállítása</span>
				</div>
			</a>
		</div>
		<div class="button__width button__margin">
			<a href="{{ $invalidateUrl }}">
				<div class="button">
					<span>Nem én voltam</span>
				</div>
			</a>
		</div>
	</div>
@endsection

@section('footer')
	<p>
		Ammennyiben a fenti gomb nem működik, kérlek másold be az alábbi linket a böngésződ címsorába:
		<br/>
		<a href="{{ $resetUrl }}">{{ $resetUrl }}</a>
	</p>
@endsection
