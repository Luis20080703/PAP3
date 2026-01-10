<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('estatistica_atletas', function (Blueprint $table) {
            $table->renameColumn('2_minutos', 'dois_minutos');
        });
    }

    public function down(): void
    {
        Schema::table('estatistica_atletas', function (Blueprint $table) {
            $table->renameColumn('dois_minutos', '2_minutos');
        });
    }
};
