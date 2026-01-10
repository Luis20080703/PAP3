<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('estatistica_atletas', 'jogos')) {
            Schema::table('estatistica_atletas', function (Blueprint $table) {
                $table->integer('jogos')->default(0)->after('media_golos');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('estatistica_atletas', 'jogos')) {
            Schema::table('estatistica_atletas', function (Blueprint $table) {
                $table->dropColumn('jogos');
            });
        }
    }
};
