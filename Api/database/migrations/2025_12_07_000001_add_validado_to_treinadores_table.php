<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('treinadores', function (Blueprint $table) {
            if (!Schema::hasColumn('treinadores', 'validado')) {
                $table->boolean('validado')->default(false)->after('epoca_id');
            }
        });
    }

    public function down()
    {
        Schema::table('treinadores', function (Blueprint $table) {
            if (Schema::hasColumn('treinadores', 'validado')) {
                $table->dropColumn('validado');
            }
        });
    }
};
