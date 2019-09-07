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
	}
}
