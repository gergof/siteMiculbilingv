<?php

use Illuminate\Database\Seeder;

class TestDatas extends Seeder {
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		DB::table('seasons')->insert([
			'name' => "Test",
		]);
		DB::table('schools')->insert([
			'name_ro' => 'Scoala',
			'name_hu' => 'Iskola',
			'county' => 'Bihor',
			'city' => 'Oradea',
		]);
		DB::table('users')->insert([
			'name' => 'test',
			'email' => 'test@miculbilingv.ro',
			'email_verification_token' => '',
			'email_verified_at' => '2000-01-01',
			'password' => Hash::make(config('auth.defaultAdminPassword')),
			'school_id' => 1,
			'class_size' => 0,
			'class' => 0,
			'role' => 'admin',
		]);
	}
}
