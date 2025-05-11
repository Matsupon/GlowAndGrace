<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSubtypeSeeder extends Seeder
{
    public function run()
    {
        DB::table('productsubtypes')->insert([
            ['SubTypeID' => 1, 'SubTypeName' => 'Cream', 'TypeID' => 1],
            ['SubTypeID' => 2, 'SubTypeName' => 'Moisturizer', 'TypeID' => 1],
            ['SubTypeID' => 3, 'SubTypeName' => 'Sunscreen', 'TypeID' => 1],
            ['SubTypeID' => 4, 'SubTypeName' => 'Toner', 'TypeID' => 1],
            ['SubTypeID' => 5, 'SubTypeName' => 'Conditioner', 'TypeID' => 2],
            ['SubTypeID' => 6, 'SubTypeName' => 'Dry Shampoo', 'TypeID' => 2],
            ['SubTypeID' => 7, 'SubTypeName' => 'Hairspray', 'TypeID' => 2],
            ['SubTypeID' => 8, 'SubTypeName' => 'Shampoo', 'TypeID' => 2],
            ['SubTypeID' => 9, 'SubTypeName' => 'Blushes', 'TypeID' => 3],
            ['SubTypeID' => 10, 'SubTypeName' => 'Concealers', 'TypeID' => 3],
            ['SubTypeID' => 11, 'SubTypeName' => 'Foundations', 'TypeID' => 3],
            ['SubTypeID' => 12, 'SubTypeName' => 'Lip Tints', 'TypeID' => 3],
        ]);
    }
}
