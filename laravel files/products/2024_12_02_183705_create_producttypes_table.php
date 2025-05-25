<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProducttypesTable extends Migration
{
    public function up()
    {
        Schema::create('producttypes', function (Blueprint $table) {
            $table->id('TypeID');
            $table->string('TypeName', 50)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('producttypes');
    }
}
