<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Método simples - usar change() se suportado
        Schema::table('dicas', function (Blueprint $table) {
            $table->string('categoria')->default(null)->change();
        });
    }

    public function down()
    {
        Schema::table('dicas', function (Blueprint $table) {
            $table->string('categoria')->default('táctica')->change();
        });
    }
};
