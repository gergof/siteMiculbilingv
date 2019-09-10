<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Seeder {
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		DB::table('users')->insert([
			'name' => 'Admin',
			'email' => 'admin@miculbilingv.ro',
			'email_verification_token' => '',
			'email_verified_at' => '2000-01-01',
			'password' => Hash::make(config('auth.defaultAdminPassword')),
			'school_id' => null,
			'class_size' => 0,
			'class' => 0,
			'role' => 'admin',
		]);
	}
}
