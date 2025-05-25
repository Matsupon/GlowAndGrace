<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2)->nullable();
            $table->unsignedBigInteger('subtype_id')->nullable();
            $table->unsignedBigInteger('type_id')->nullable();
            $table->string('category')->nullable();
            $table->string('image')->nullable();
            $table->string('fda_image')->nullable();
            $table->boolean('is_admin_created')->default(false);
            $table->boolean('is_fda_approved')->default(false);
            $table->timestamps();

            $table->foreign('subtype_id')
                ->references('SubTypeID')
                ->on('productsubtypes')
                ->onDelete('set null');

            $table->foreign('type_id')
                ->references('TypeID')
                ->on('producttypes')
                ->onDelete('set null');
        });

    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}
