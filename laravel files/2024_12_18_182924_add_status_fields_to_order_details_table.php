<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('order_details', function (Blueprint $table) {
            if (!Schema::hasColumn('order_details', 'status')) {
                $table->string('status')->default('Pickup');
            }
            if (!Schema::hasColumn('order_details', 'status_description')) {
                $table->string('status_description')->default('Order is placed');
            }
        });
    }

    public function down()
    {
        Schema::table('order_details', function (Blueprint $table) {
            $table->dropColumn(['status', 'status_description']);
        });
    }
};