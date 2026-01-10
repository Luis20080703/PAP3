<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('estatistica_atletas', function (Blueprint $table) {
            $table->integer('cartoes_amarelos')->default(0)->after('media_golos');
            $table->integer('cartoes_vermelhos')->default(0)->after('cartoes_amarelos');
            $table->integer('2_minutos')->default(0)->after('cartoes_vermelhos');
        });
    }

    public function down()
    {
        Schema::table('estatistica_atletas', function (Blueprint $table) {
            $table->dropColumn(['cartoes_amarelos', 'cartoes_vermelhos', '2_minutos']);
        });
    }
};
