<!DOCTYPE html>
<html>
	<head>
		@section('head')
			<title>@yield('title')</title>
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
				}
				.button__width {
					width: 15em;
				}
				.button {
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
				.button:hover {
					box-shadow: 2px 2px 7px 3px #BDBDBD;
					background: #0097A7;
				}
				.signature {
					text-align: right;
					font-style: italic;
					margin-top: 2em;
					color: #757575;
				}
				.footer {
					font-size: 0.8em;
					color: #757575;
					margin-top: 4em;
					text-align: center;
				}
				.actionsHolder {
					display: flex;
					margin: 2em auto;
					flex-flow: row;
					flex-wrap: wrap;
					align-content: center;
				}
				@media screen and (max-width: 768px) {
					.container {
						width: 95%;
					}
				}
			</style>
		@show
	</head>
	<body>
		<div class="container">
			<div class="header">
				<div class="header__text">
					<h1>@yield('title')</h1>
				</div>
			</div>
			<div class="content">
				<div class="content__text">
					@yield('content')
					@section('signature')
						<p class="signature">Üdvözlettel,<br/>A Micul Bilingv csapata</p>
					@show
					@yield('actions')
					<div class="footer">
						@yield('footer')
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
