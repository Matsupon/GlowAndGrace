<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductTypeSeeder extends Seeder
{
    public function run()
    {
        DB::table('producttypes')->insert([
            ['TypeID' => 1, 'TypeName' => 'Skincare'],
            ['TypeID' => 2, 'TypeName' => 'Haircare'],
            ['TypeID' => 3, 'TypeName' => 'Makeup'],
        ]);
    }
}

