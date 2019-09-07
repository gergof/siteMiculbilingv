@extends('emails.Base')

@section('title', 'Sikeres regisztráció')

@section('content')
	<p>Kedves {{ $name }}!</p>
	<p>
		Köszöntünk a Micul Bilingv weboldalán! A regisztrációd véglegesítéséhez meg kell erősítsd az email címedet. Ehhez kérlek kattints az alábbi gombra!
	</p>
@endsection

@section('actions')
	<div class="button__width button__margin">
		<a href="{{ $confirmationUrl }}">
			<div class="button">
				<span>Regisztráció megerősítése</span>
			</div>
		</a>
	</div>
@endsection

@section('footer')
	<p>
		Ammennyiben a fenti gomb nem működik, kérlek másold be az alábbi linket a böngésződ címsorába:
		<br/>
		<a href="{{ $confirmationUrl }}">{{ $confirmationUrl }}</a>
	</p>
@endsection
