<!DOCTYPE html>
<html>
	<head>
		<title>Sikeres regisztráció!</title>
		<meta charset="UTF-8"/>
		<style>
			a {
				text-decoration: none;
			}
			.container {
				width: 70%;
				margin: auto;
				border-radius: 1px;
				box-shadow: 5px 5px 5px 2px #BDBDBD;
			}
			.header {
				width: 100%;
				background: #00BCD4;
				box-shadow: 0 1px 10px 1px #BDBDBD;
			}
			.header__text {
				padding: 1em 1em;
				color: #FFFFFF;
			}
			.content {
				width: 100%;
			}
			.content__text {
				margin: 1em;
				padding: 1em;
			}
			.button__margin {
				margin: 2em auto;
				width: 15em;
			}
			.button__confirm {
				border-radius: 1px;
				box-shadow: 2px 2px 5px 2px #BDBDBD;
				padding: 2em 1em;
				background: #00BCD4;
				text-align: center;
				transition: 0.3s ease-in-out;
				cursor: pointer;
				text-decoration: none;
				color: #FFFFFF;
			}
			.button__confirm:hover {
				box-shadow: 2px 2px 7px 3px #BDBDBD;
				background: #0097A7;
			}
			.signature {
				text-align: right;
				font-style: italic;
				margin-top: 2em;
				color: #757575;
			}
			.confirmUrl {
				font-size: 0.8em;
				color: #757575;
				text-align: center;
			}
			@media screen and (max-width: 768px) {
				.container {
					width: 95%;
				}
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<div class="header__text">
					<h1>Sikeres regisztráció</h1>
				</div>
			</div>
			<div class="content">
				<div class="content__text">
					<p>Kedves {{ $name }}!</p>
					<p>
						Köszöntünk a Micul Bilingv weboldalán! A regisztrációd véglegesítéséhez meg kell erősítsd az email címedet. Ehhez kérlek kattints az alábbi gombra!
					</p>
					<p class="signature">Üdvözlettel,<br/>A Micul Bilingv csapata</p>
					<div class="button__margin">
						<a href="{{ $confirmationUrl }}">
							<div class="button__confirm">
								<span>Regisztráció megerősítése</span>
							</div>
						</a>
					</div>
					<p class="confirmUrl">
						Ammennyiben a fenti gomb nem működik, kérlek másold be az alábbi linket a böngésződ címsorába:
						<br/>
						<a href="{{ $confirmationUrl }}">{{ $confirmationUrl }}</a>
					</p>
				</div>
			</div>
		</div>
	</body>
</html>
