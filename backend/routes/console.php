<?php

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
 */

Artisan::command('resetDB', function () {
	$this->info('Resetting SQLite database');

	if (file_exists('database/database.sqlite')) {
		$this->info('Deleting database.sqlite');
		unlink('database/database.sqlite');
	}

	$this->info('Creating database.sqlite');
	touch('database/database.sqlite');

	$this->info('Migrating');
	Artisan::call('migrate');

	$this->info('Seeding test data');
	Artisan::call('db:seed --class=TestDatas');
});
