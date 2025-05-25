<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsubtypesTable extends Migration
{
    public function up()
    {
        Schema::create('productsubtypes', function (Blueprint $table) {
            $table->id('SubTypeID');
            $table->string('SubTypeName', 50)->nullable();
            $table->foreignId('TypeID')->nullable()->constrained('producttypes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('productsubtypes');
    }
}
